from fastapi import FastAPI
from app.database import get_all_news_events
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "analytics"}

@app.get("/api/analytics/metrics")
def get_analytics_metrics():
   
    raw_data = get_all_news_events()
    
    category_counts = {}
    source_counts = {}
    total_events = 0
    total_articles = 0

    for item in raw_data:
        category = item.get("category", "Nepoznato")
        category_counts[category] = category_counts.get(category, 0) + 1
        
        item_type = item.get("type", "ARTICLE")
        
        if item_type == "EVENT":
            total_events += 1
            articles = item.get("articles", [])
            for article in articles:
                total_articles += 1
                source = article.get("source", "Nepoznato")
                source_counts[source] = source_counts.get(source, 0) + 1
        else:
            total_articles += 1
            source = item.get("source", "Nepoznato")
            source_counts[source] = source_counts.get(source, 0) + 1

    return {
        "status": "success",
        "metrics": {
            "ukupno_zapisa_u_bazi": len(raw_data),
            "ukupno_grupiranih_dogadjaja": total_events,
            "ukupno_analiziranih_clanaka": total_articles,
            "broj_vijesti_po_kategorijama": category_counts,
            "broj_clanaka_po_izvorima": source_counts
        }
    }