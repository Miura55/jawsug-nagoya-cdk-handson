FROM python:3.10

WORKDIR /app
RUN apt-get update && apt-get upgrade -y

COPY ../api/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
