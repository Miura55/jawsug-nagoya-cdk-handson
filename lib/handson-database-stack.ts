import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";


interface DatabaseStackProps extends cdk.StackProps {
  tableName: string;
  fargateService: ApplicationLoadBalancedFargateService;
}

export class DatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const table = new Table(this, "TodoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: props.tableName,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // FargateタスクにDynamoDBへのアクセス権限を付与する
    table.grantFullAccess(props.fargateService.taskDefinition.taskRole);
  }
}
