FROM python:3.10

WORKDIR /app
RUN apt-get update && apt-get upgrade -y

COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./app.py /app
COPY ./schemes.py /app

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
