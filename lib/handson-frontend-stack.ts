import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CloudFrontWebDistribution, OriginAccessIdentity, PriceClass } from 'aws-cdk-lib/aws-cloudfront';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';


export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webBucket = new Bucket(this, 'WebBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFrontのOrigin Access Identityを作成する
    const websiteIdentify = new OriginAccessIdentity(this, 'WebsiteIdentify', {
      comment: 'Website identify for S3 bucket'
    });

    // S3バケットへのアクセス権限を付与する
    const bucketPolicyStatement = new PolicyStatement({
      actions: ['s3:GetObject'],
      effect: Effect.ALLOW,
      resources: [webBucket.bucketArn + '/*'],
      principals: [websiteIdentify.grantPrincipal],
    });
    webBucket.addToResourcePolicy(bucketPolicyStatement);
  
    const webDistribution = new CloudFrontWebDistribution(this, 'WebDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: webBucket,
            originAccessIdentity: websiteIdentify,
          },
          behaviors: [{ 
            isDefaultBehavior: true
          }],
        }
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 200,
          errorCachingMinTtl: 300,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 403,
          responseCode: 200,
          errorCachingMinTtl: 300,
          responsePagePath: '/index.html',
        }
      ],
      priceClass: PriceClass.PRICE_CLASS_ALL,
    });

    // S3バケットにビルドしたフロントエンドのファイルをデプロイする
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset(path.join(__dirname, '../todo-app/build'))],
      destinationBucket: webBucket,
      distribution: webDistribution,
      distributionPaths: ['/*'],
    });

    // CloudFrontのURLを出力する
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${webDistribution.distributionDomainName}`,
    });
  }
}
