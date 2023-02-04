import os
import ulid
import aioboto3
from fastapi import FastAPI
from schemes import Message

app = FastAPI()
session = aioboto3.Session()
region = os.getenv("AWS_REGION", "ap-southeast-1")
dynamo_endpoint = os.getenv("DYNAMO_ENDPOINT", None)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/message")
async def message(body: Message):
    id = ulid.new()
    async with session.resource("dynamodb", region, endpoint_url=dynamo_endpoint) as database:
        table = await database.Table("todo")
        await table.put_item(
            Item={
                "id": id.str,
                "message": body.message,
            }
        )
    return {"id": id.str}

@app.get("/messages")
async def get_messages():
    async with session.resource("dynamodb", region, endpoint_url=dynamo_endpoint) as database:
        table = await database.Table("todo")
        response = await table.scan()
        return response["Items"]
