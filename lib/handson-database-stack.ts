import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { IRole } from "aws-cdk-lib/aws-iam";


interface DatabaseStackProps extends cdk.StackProps {
  tableName: string;
  fargateTaskRole: IRole;
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
    table.grantFullAccess(props.fargateTaskRole);
  }
}
