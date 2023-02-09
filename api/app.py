# coding: utf-8
'''
How to run:
$ uvicorn app:app --reload --host 0.0.0.0 --port 5000
'''

import os
import ulid
import aioboto3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemes import Message, Item, Result

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = aioboto3.Session()
region = os.getenv("AWS_REGION", "ap-southeast-1")
dynamo_table = os.getenv("DYNAMO_TABLE", "todo")
dynamo_endpoint = os.getenv("DYNAMO_ENDPOINT", None)


@app.get("/", response_model=Message)
async def root():
    return {"message": "Hello World"}

@app.get("/messages", response_model=list[Item])
async def get_messages():
    async with session.resource("dynamodb", region, endpoint_url=dynamo_endpoint) as database:
        table = await database.Table(dynamo_table)
        response = await table.scan()
        return response["Items"]

@app.post("/message", response_model=Item)
async def message(body: Message):
    id = ulid.new()
    async with session.resource("dynamodb", region, endpoint_url=dynamo_endpoint) as database:
        table = await database.Table(dynamo_table)
        await table.put_item(
            Item={
                "id": id.str,
                "message": body.message,
            }
        )
    return {"id": id.str, "message": body.message}

@app.delete("/message/{id}", response_model=Result)
async def delete_message(id: str):
    async with session.resource("dynamodb", region, endpoint_url=dynamo_endpoint) as database:
        table = await database.Table("todo")
        await table.delete_item(
            Key={
                "id": id,
            }
        )
    return {"result": "ok"}
