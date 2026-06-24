FROM python:3.11-slim

WORKDIR /workspace

RUN pip install --no-cache-dir boto3 web3 py-solc-x

COPY setup.py .

CMD ["python", "setup.py"]