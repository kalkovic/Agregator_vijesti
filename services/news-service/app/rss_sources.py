from pydantic import BaseModel, HttpUrl


class RssSource(BaseModel):
    id: str
    name: str
    feed_url: HttpUrl


RSS_SOURCES: list[RssSource] = [
    RssSource(
        id="index",
        name="Index.hr",
        feed_url="https://www.index.hr/rss",
    ),
    RssSource(
        id="jutarnji",
        name="Jutarnji.hr",
        feed_url="https://www.jutarnji.hr/rss",
    ),
    RssSource(
        id="24sata",
        name="24sata.hr",
        feed_url="https://www.24sata.hr/rss",
    ),
]


def get_rss_sources() -> list[RssSource]:
    return RSS_SOURCES
