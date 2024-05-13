from pydantic import BaseModel

Token = str


class NotificationMessage(BaseModel):
    title: str
    text: str
