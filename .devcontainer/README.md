# Devcontainerを使った開発環境の構築
Devcontainerを使うことで自動的に開発環境を構築することができます。

## 前提条件
- Dockerがインストールされていること
- VSCodeがインストールされていること
- VSCodeの拡張機能「Remote - Containers」がインストールされていること

## 使い方
1. VSCodeでこのリポジトリを開きます。
2. 左下の緑色の「><」をクリックします。
3. 「Reopen in Container」をクリックします。
4. しばらく待つと開発環境が構築されます。

## AWS CLIの設定
### サンプルファイルからコピーする場合
CDKを使う場合は予めAWS CLIの設定を行っておく必要があります。

`aws_config`ディレクトリがdevcontainer環境のAWS CLIの設定ファイルの保存先にマウントされており、ホストOSでサンプルファイルからコピーすると設定ファイルを用意できるのでそちらでご自身の環境に合わせて設定してください。

```bash
$ cp aws_config/config.sample aws_config/config
$ cp aws_config/credentials.sample aws_config/credentials
```

### コマンドで設定する場合
別の方法としてDevcontainer環境には、AWS CLIがインストールされているので、 `aws configure` コマンドを実行して設定を行っても構いません。

