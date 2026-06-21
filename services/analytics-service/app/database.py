import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
    'dynamodb', 
    endpoint_url='http://localhost:8001',  
    region_name='eu-central-1',            
    aws_access_key_id='test',              
    aws_secret_access_key='test'
)

TABLE_NAME = "news-events" 
table = dynamodb.Table(TABLE_NAME)

def get_all_news_events():
    try:
        response = table.scan()
        data = response.get('Items', [])
        
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            data.extend(response.get('Items', []))
            
        return data
    except ClientError as e:
        print(f"Greška pri čitanju baze: {e.response['Error']['Message']}")
        return []