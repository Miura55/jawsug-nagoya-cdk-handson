import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { Cluster, ContainerImage, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnVpcLink, CfnIntegration, CfnRoute } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi, CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';


interface ApiStackProps extends cdk.StackProps {
  tableName: string;
}

export class ApiStack extends cdk.Stack {
  public readonly fargateService: ApplicationLoadBalancedFargateService;
  public readonly apiEndpoint: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    // ECSクラスターを作成する
    const cluster = new Cluster(this, 'Cluster', {
      clusterName: 'handson-api-cluster',
      vpc: vpc,
    });

    // DockerImageAssetを使って、DockerイメージをビルドしてECRにプッシュする
    const imageAsset = new DockerImageAsset(this, 'ImageAsset', {
      directory: path.join(__dirname, '../api')
    });

    // Fargateサービスを作成する(ロードバランサー付き)
    const fargateService = new ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(imageAsset),
        containerPort: 8000,
        enableLogging: true,
        logDriver: LogDriver.awsLogs({
          streamPrefix: 'handson-api',
          logRetention: RetentionDays.ONE_DAY,
        }),
        environment: {
          'AWS_REGION': this.region,
          'DYNAMO_TABLE': props.tableName,
        }
      },
      taskSubnets: {
        subnets: cluster.vpc.privateSubnets,
      },
      publicLoadBalancer: true,
    });
    this.fargateService = fargateService;

    // VPC Link
    const httpVpcLink = new CfnVpcLink(this, 'HttpVpcLink', {
      name: 'handson-api-vpc-link',
      subnetIds: cluster.vpc.privateSubnets.map(subnet => subnet.subnetId),
    });

    // HTTP API
    const api = new HttpApi(this, 'HttpApi', {
      apiName: 'handson-api',
      corsPreflight: {
        allowOrigins: ['*'],
        allowHeaders: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
      },
    });
    this.apiEndpoint = api.apiEndpoint;

    const integration = new CfnIntegration(this, 'HttpApiIntegration', {
      apiId: api.apiId,
      description: 'handson-api',
      connectionId: httpVpcLink.ref,
      connectionType: 'VPC_LINK',
      integrationType: 'HTTP_PROXY',
      integrationMethod: 'ANY',
      integrationUri: fargateService.listener.listenerArn,
      payloadFormatVersion: '1.0',
    });

    // HTTP APIのルートを作成する
    new CfnRoute(this, 'HttpApiRoute', {
      apiId: api.apiId,
      routeKey: 'ANY /{proxy+}',
      target: `integrations/${integration.ref}`,
    });

    // APIのエンドポイントを出力する
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.apiEndpoint,
    });
  }
}
