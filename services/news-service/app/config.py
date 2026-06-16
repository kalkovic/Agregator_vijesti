from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    log_level: str = "INFO"

    host: str = Field(default="0.0.0.0", validation_alias="NEWS_SERVICE_HOST")
    port: int = Field(default=8000, validation_alias="NEWS_SERVICE_PORT")

    dynamodb_endpoint: str = "http://localhost:8001"
    dynamodb_region: str = "eu-central-1"
    dynamodb_events_table: str = "news-events"
    aws_access_key_id: str = "local"
    aws_secret_access_key: str = "local"

    rss_feeds: str = (
        "https://www.index.hr/rss,"
        "https://www.jutarnji.hr/rss,"
        "https://www.24sata.hr/rss"
    )

    ganache_url: str = "http://localhost:8545"
    contract_address: str = ""
    private_key: str = ""

    @property
    def rss_feed_list(self) -> list[str]:
        return [url.strip() for url in self.rss_feeds.split(",") if url.strip()]


settings = Settings()
