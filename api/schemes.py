from pydantic import BaseModel


class Message(BaseModel):
    message: str


class Item(BaseModel):
    id: str
    message: str


class Result(BaseModel):
    result: str
