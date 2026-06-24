import os
import sys
import time
import json
import subprocess
import boto3
from botocore.exceptions import ClientError
from web3 import Web3
from solcx import compile_standard, install_solc

DYNAMODB_URL = os.getenv("DYNAMODB_URL", "http://dynamodb-local:8000")
WEB3_PROVIDER_URL = os.getenv("WEB3_PROVIDER_URL", "http://ganache-cli:8545")

def wait_for_services():
    print("Čekam povezivanje s Ganache blockchainom...")
    w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))
    while not w3.is_connected():
        time.sleep(2)
    print("Ganache je spreman!")

    print(f"Čekam povezivanje s DynamoDB Local na adresi: {DYNAMODB_URL}...")
    db_client = boto3.client(
        'dynamodb',
        endpoint_url=DYNAMODB_URL,
        region_name=os.getenv("AWS_DEFAULT_REGION", "eu-central-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "akiahubnews2026local"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "secretaccesskeyhubnews2026local"),
        aws_session_token=None # Eksplicitno onemogućavamo sesijske tokene
    )
    
    while True:
        try:
            db_client.list_tables()
            print("✅ DynamoDB je spreman!")
            return db_client
        except Exception as e:
            print(f"Pokušavam ponovno... Detalji greške: {e}")
            time.sleep(2)

def create_table_safely(db_client, table_name, key_schema, attribute_definitions):
    try:
        db_client.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            BillingMode='PAY_PER_REQUEST'
        )
        print(f"Tablica '{table_name}' uspješno kreirana!")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceInUseException':
            print(f"ℹ Tablica '{table_name}' već postoji. Preskačem kreiranje.")
        else:
            print(f"❌ Greška pri kreiranju tablice {table_name}: {e}")

def deploy_blockchain():
    print("\n🔗 Pokrećem blockchain deploy...")
    try:
        CONTRACT_PATH = "/blockchain/NewsRegistry.sol"
        OUTPUT_PATH = "/blockchain/deployed_contract.json"

        if not os.path.exists(CONTRACT_PATH):
            print(f"❌ Datoteka {CONTRACT_PATH} ne postoji!")
            return False

        print("-> Instaliram Solidity kompajler v0.8.0...")
        install_solc("0.8.0")

        with open(CONTRACT_PATH, "r", encoding="utf-8") as file:
            news_registry_file = file.read()

        print("-> Kompajliram pametni ugovor...")
        compiled_sol = compile_standard(
            {
                "language": "Solidity",
                "sources": {"NewsRegistry.sol": {"content": news_registry_file}},
                "settings": {
                    "outputSelection": {
                        "*": {
                            "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                        }
                    }
                }
            },
            solc_version="0.8.0",
        )

        bytecode = compiled_sol["contracts"]["NewsRegistry.sol"]["NewsRegistry"]["evm"]["bytecode"]["object"]
        abi = json.loads(compiled_sol["contracts"]["NewsRegistry.sol"]["NewsRegistry"]["metadata"])["output"]["abi"]

        w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))

        if not w3.is_connected():
            print("❌ GREŠKA: Ne mogu se spojiti na Ganache! Pokušavam ponovno...")
            time.sleep(3)
            if not w3.is_connected():
                print("❌ Még uvijek nije dostupan.")
                return False

        print("✅ Uspješno spojen na Ganache blockchain.")

        w3.eth.default_account = w3.eth.accounts[0]

        print("-> Pokrećem deploy ugovora na mrežu...")
        NewsRegistry = w3.eth.contract(abi=abi, bytecode=bytecode)

        tx_hash = NewsRegistry.constructor().transact()
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        contract_address = tx_receipt.contractAddress
        print(f"🎉 Pametni ugovor je USPJEŠNO POSTAVLJEN!")
        print(f"📍 Adresa ugovora: {contract_address}")

        deployment_info = {
            "contract_address": contract_address,
            "abi": abi
        }

        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(deployment_info, f, indent=4, ensure_ascii=False)

        print(f"💾 Podaci za spajanje spremljeni u: {OUTPUT_PATH}")
        print("✅ Blockchain deploy uspješan!")
        return True

    except Exception as e:
        print(f"❌ Greška pri blockchain deployu: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    db_client = wait_for_services()

    create_table_safely(
        db_client,
        table_name="Users",
        key_schema=[{'AttributeName': 'email', 'KeyType': 'HASH'}],
        attribute_definitions=[{'AttributeName': 'email', 'AttributeType': 'S'}]
    )

    create_table_safely(
        db_client,
        table_name="News",
        key_schema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
        attribute_definitions=[{'AttributeName': 'id', 'AttributeType': 'S'}]
    )

    create_table_safely(
        db_client,
        table_name="Analytics",
        key_schema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
        attribute_definitions=[{'AttributeName': 'id', 'AttributeType': 'S'}]
    )

    deploy_blockchain()

    print("\nSve inicijalizacijske skripte su uspješno izvršene! Kontejner se gasi...")

if __name__ == "__main__":
    main()