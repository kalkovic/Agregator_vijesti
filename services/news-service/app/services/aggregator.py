# services/news-service/app/services/aggregator.py
import uuid
from app.models.article import Article
from app.models.event import Event
from app.services.similarity import calculate_jaccard_similarity

class EventAggregator:
    def __init__(self, similarity_threshold: float = 0.3):
        self.similarity_threshold = similarity_threshold

    def aggregate_articles(self, incoming_articles: list[Article], existing_events: list[Event]) -> tuple[list[Article], list[Event]]:
        """
        Grupira dolazne članke u događaje (nove ili postojeće) prema tvom Event modelu.
        """
        updated_articles = []
        events_dict = {event.id: event for event in existing_events}
        
        for article in incoming_articles:
            matched_event_id = None
            
            # 1. Pokušaj spojiti članak s postojećim događajem
            for event in events_dict.values():
                similarity = calculate_jaccard_similarity(article.title, event.title)
                
                if similarity >= self.similarity_threshold:
                    matched_event_id = event.id
                    
                    # Dodaj članak u listu artikala tog događaja
                    event.articles.append(article)
                    
                    # Izračunaj jedinstvene izvore (source) unutar tog događaja za source_count
                    unique_sources = {art.source for art in event.articles}
                    event.source_count = len(unique_sources)
                    break
            
            # 2. Ako nismo našli sličan događaj, kreiramo skroz novi Event
            if not matched_event_id:
                new_event_id = str(uuid.uuid4())
                new_event = Event(
                    id=new_event_id,
                    title=article.title,
                    category=article.category or "Općenito",
                    articles=[article],  # Prvi članak u listi
                    source_count=1,
                    created_at=article.published_at,
                    updated_at=article.published_at
                )
                events_dict[new_event_id] = new_event
                matched_event_id = new_event_id
            
            # 3. Zapiši event_id u članak
            article.event_id = matched_event_id
            updated_articles.append(article)
            
        return updated_articles, list(events_dict.values())