#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/handson-api-stack';
import { DatabaseStack } from '../lib/handson-database-stack';


const app = new cdk.App();
const tableName = 'handson-todo-table';

const apiStack = new ApiStack(app, 'CdkHandsonApiStack', {
  env: { region: 'ap-northeast-1' },
  tableName: tableName,
});

new DatabaseStack(app, 'CdkHandsonDatabaseStack', {
  env: { region: 'ap-northeast-1' },
  tableName: tableName,
  fargateTaskRole: apiStack.fargateTaskRole,
});
