import boto3
from botocore.exceptions import ClientError

DYNAMODB_URL = "http://localhost:8001"
REGION = "eu-central-1"

dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url=DYNAMODB_URL,
    region_name=REGION,
    aws_access_key_id='test',
    aws_secret_access_key='test'
)

def create_users_table():
    try:
        table = dynamodb.create_table(
            TableName='Users',
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.meta.client.get_waiter('table_exists').wait(TableName='Users')
        print("✅ Tablica 'Users' je uspješno kreirana u DynamoDB-u!")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print("⚡ Tablica 'Users' već postoji, preskačem kreiranje.")
        else:
            print("❌ Greška pri kreiranju tablice:", e)

def get_users_table():
    return dynamodb.Table('Users')