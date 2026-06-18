import boto3
from app.config import settings

def get_dynamodb_client():
    return boto3.resource(
        'dynamodb',
        endpoint_url=settings.dynamodb_endpoint,         
        region_name=settings.dynamodb_region,            
        aws_access_key_id=settings.aws_access_key_id,    
        aws_secret_access_key=settings.aws_secret_access_key 
    )

def create_articles_table():
    db = get_dynamodb_client()
    
    existing_tables = [table.name for table in db.tables.all()]
    if settings.dynamodb_events_table in existing_tables: 
        print(f"Tablica '{settings.dynamodb_events_table}' vec postoji u DynamoDB-u.")
        return db.Table(settings.dynamodb_events_table)

    print(f"Kreiram tablicu '{settings.dynamodb_events_table}' na lokaciji {settings.dynamodb_endpoint}...")
    
    table = db.create_table(
        TableName=settings.dynamodb_events_table,         
        KeySchema=[
            {'AttributeName': 'id', 'KeyType': 'HASH'}
        ],
        AttributeDefinitions=[
            {'AttributeName': 'id', 'AttributeType': 'S'}
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )
    
    table.meta.client.get_waiter('table_exists').wait(TableName=settings.dynamodb_events_table)
    print("-> Tablica je uspjesno kreirana i spremna za rad!")
    return table

if __name__ == "__main__":
    print("Inicijalizacija baze pokrenuta...")
    create_articles_table()
    print("Skripta je zavrsila s radom.")