from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = "INFO"
    similarity_threshold: float = 0.3


    host: str = Field(default="0.0.0.0", validation_alias="NEWS_SERVICE_HOST")
    port: int = Field(default=8000, validation_alias="NEWS_SERVICE_PORT")

    dynamodb_endpoint: str = Field(default="http://dynamodb-local:8000", validation_alias="DYNAMODB_URL")
    dynamodb_region: str = "eu-central-1"
    dynamodb_events_table: str = "news-events"
    aws_access_key_id: str = Field(default="akiahubnews2026local", validation_alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(default="secretaccesskeyhubnews2026local", validation_alias="AWS_SECRET_ACCESS_KEY")

    rss_feeds: str = (
        "https://www.index.hr/rss,"
        "https://www.jutarnji.hr/rss,"
        "https://www.24sata.hr/rss"
    )

    ganache_url: str = Field(default="http://ganache-cli:8545", validation_alias="WEB3_PROVIDER_URL")
    contract_address: str = ""
    private_key: str = ""

    @property
    def rss_feed_list(self) -> list[str]:
        return [url.strip() for url in self.rss_feeds.split(",") if url.strip()]


settings = Settings()
