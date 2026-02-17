# Project Constitution: AI/ML Innovation Pilot

## 1. Project Purpose
Build a deterministic, self-healing scraper and a premium dashboard to aggregate high-value news for AI/ML Engineers.

## 2. Data Schemas

### Article Payload (JSON)
```json
{
  "id": "string (hash of URL)",
  "title": "string",
  "summary": "string (brief summary/excerpt)",
  "link": "string (url)",
  "source": "string (Ben's Bytes, AI Rundown, Reddit, etc.)",
  "published_at": "ISO8601 string",
  "relevance_score": "float (0.0 - 1.0)",
  "tags": ["career", "innovation", "business", "technical"],
  "scraped_at": "ISO8601 string"
}
```


## 3. Behavioral Rules
- **Data First:** No scraping without schema validation.
- **24h Cycle:** Scrape latest 24h of data. If no new data, fallback to most recent.
- **Filtering:** Focus on "How AI/ML engineers can stand out" and "Business problem solving".
- **Reliability:** Use Layer 3 tools for scraping with heavy error handling.

## 4. Architectural Invariants
- Frontend: Premium Next.js/Vite (to be built later).
- Database: Supabase (integration in Phase 5).
- Storage: `.tmp/` for raw scraped data.

## 5. Maintenance Log
- 2026-02-13: Initial Schema defined.

