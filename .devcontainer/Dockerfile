ARG VARIANT=3-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

ENV PYTHONUNBUFFERED 1

# Install dependencies 
RUN apt-get update && \
    apt-get install -y less vim curl unzip sudo

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN sudo ./aws/install

# [Choice] Node.js version: none, lts/*, 16, 14, 12, 10
ARG NODE_VERSION="16"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

# Install AWS CDK
RUN npm install -g aws-cdk

RUN apt-get update && apt-get upgrade -y

COPY ../api/requirements.txt ./requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
