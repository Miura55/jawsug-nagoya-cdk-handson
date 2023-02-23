# JAWS UG 名古屋 「AWS CDKハンズオン」
このレポジトリでは、JAWS UG 名古屋の「AWS CDKハンズオン」で使用するサンプルコードを公開しています。

## テキスト
https://miura55.github.io/cdk-handson-text

## ローカル環境の構築
### APIの実行環境
`api` ディレクトリに移動して以下のコマンドで構築するとローカルのAPIが起動します

```
cd api
docker compose up -d
```

### ローカル環境のDynamoDBのテーブルの作成方法
ローカルのAPIを起動するとDynamoDB Localも起動するので、以下のコマンドでテーブルを作成できます。

事前に [AWS CLI](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Tools.CLI.html)をセットアップしておく必要があります。(ローカルのDynamoDBを使うだけであれば`aws configure`で仮の認証情報を入力すればDynamo DBのコマンドを使えます)

```
aws dynamodb create-table \
    --endpoint-url "http://localhost:8000" \
    --table-name todo \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --table-class STANDARD
```
