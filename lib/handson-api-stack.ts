import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { Cluster, ContainerImage, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';


interface ApiStackProps extends cdk.StackProps {
  tableName: string;
}

export class ApiStack extends cdk.Stack {
  public readonly fargateService: ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // DockerImageAssetを使って、DockerイメージをビルドしてECRにプッシュする
    const imageAsset = new DockerImageAsset(this, 'ImageAsset', {
      directory: path.join(__dirname, '../api')
    });

    // ECSクラスターを作成する
    const cluster = new Cluster(this, 'Cluster', {
      clusterName: 'handson-api-cluster',
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

    // 作成したサービスの情報を出力する
    new cdk.CfnOutput(this, 'LoadBalancerSecurityGroup', {
      value: fargateService.loadBalancer.connections.securityGroups[0].securityGroupId,
    });
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
