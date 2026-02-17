import json
import hashlib
import time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# Data Schema (from gemini.md)
# {
#   "id": "string",
#   "title": "string",
#   "summary": "string",
#   "link": "string",
#   "source": "string",
#   "published_at": "ISO8601 string",
#   "relevance_score": 0.5,
#   "tags": [],
#   "scraped_at": "ISO8601 string"
# }

DATA_FILE = ".tmp/articles.json"

def generate_id(url):
    return hashlib.md5(url.encode()).hexdigest()

def normalize_article(title, link, source, summary="", published_at=None, tags=None):
    if not published_at:
        published_at = datetime.utcnow().isoformat()
    
    return {
        "id": generate_id(link),
        "title": title.strip(),
        "summary": summary.strip()[:200] + "..." if len(summary) > 200 else summary.strip(),
        "link": link,
        "source": source,
        "published_at": published_at,
        "relevance_score": calculate_relevance(title + " " + summary),
        "tags": tags or [],
        "scraped_at": datetime.utcnow().isoformat()
    }

def calculate_relevance(text):
    # French and English keywords for general AI interest
    keywords = [
        "outil", "astuce", "productivité", "tuto", "guide", "facile", "débutant",
        "tool", "hack", "productivity", "tutorial", "easy", "beginner", "ai", "ia"
    ]
    score = 0.5
    text = text.lower()
    for kw in keywords:
        if kw in text:
            score += 0.05
    return min(score, 1.0)

def scrape_substack(slug, source_name):
    print(f"Scraping {source_name} (Substack)...")
    articles = []
    cutoff = datetime.utcnow() - timedelta(hours=72) # Expand window slightly
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36")
        page = context.new_page()
        page.goto(f"https://{slug}.substack.com/archive", wait_until="domcontentloaded", timeout=20000)
        
        posts = page.query_selector_all(".post-preview")
        # Fallback if specific classes fail
        if not posts:
            links = page.query_selector_all("a[href*='/p/']")
            for link_el in links[:10]:
                href = link_el.get_attribute("href")
                title = link_el.inner_text().strip()
                if title and len(title) > 10:
                    articles.append(normalize_article(title, href, source_name, "Intelligence brief from Substack archive."))
        else:
            for post in posts:
                title_el = post.query_selector(".post-preview-title")
                link_el = post.query_selector("a.post-preview-title")
                date_el = post.query_selector("time")
                
                if title_el and link_el:
                    title = title_el.inner_text()
                    link = link_el.get_attribute("href")
                    summary_el = post.query_selector(".post-preview-description")
                    summary = summary_el.inner_text() if summary_el else ""
                    
                    articles.append(normalize_article(title, link, source_name, summary))
                    if len(articles) >= 5: break
        
        browser.close()
    return articles

def scrape_beehiiv(slug, source_name):
    print(f"Scraping {source_name} (Beehiiv)...")
    articles = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        page = context.new_page()
        page.goto(f"https://{slug}/archive", wait_until="domcontentloaded", timeout=60000)
        
        links = page.query_selector_all("a[href^='/p/']")
        for link_el in links:
            href = link_el.get_attribute("href")
            full_link = f"https://{slug}{href}"
            
            raw_text = link_el.inner_text().strip()
            if not raw_text: continue
            
            lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
            title = lines[0] if lines else "Untitled Article"
            summary = " ".join(lines[1:]) if len(lines) > 1 else ""
            title = title.split("PLUS:")[0].strip()
            
            articles.append(normalize_article(title, full_link, source_name, summary))
            if len(articles) >= 5: break
        
        browser.close()
    return articles

def scrape_ainews_africa():
    print("Scraping AI News Africa...")
    articles = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("https://ai-news.africa/", wait_until="networkidle", timeout=30000)
            posts = page.query_selector_all(".entry-title a")
            for link_el in posts[:5]:
                title = link_el.inner_text()
                link = link_el.get_attribute("href")
                articles.append(normalize_article(title, link, "AI News Africa", "Continental AI analysis and ecosystem updates."))
        except Exception as e:
            print(f"Error AI News Africa details: {e}")
        browser.close()
    return articles

def scrape_iafrica():
    print("Scraping iAfrica...")
    articles = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("https://iafrica.com/category/innovation/ai/", wait_until="domcontentloaded", timeout=30000)
            links = page.query_selector_all(".entry-title a")
            for link_el in links[:5]:
                title = link_el.inner_text()
                link = link_el.get_attribute("href")
                articles.append(normalize_article(title, link, "iAfrica AI", "Innovation and AI trends in the African market."))
        except Exception as e:
            print(f"Error iAfrica: {e}")
        browser.close()
    return articles

def save_articles(new_articles):
    try:
        with open(DATA_FILE, "r") as f:
            existing = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing = []

    existing_ids = {a["id"] for a in existing}
    added_count = 0
    for article in new_articles:
        if article["id"] not in existing_ids:
            existing.append(article)
            added_count += 1
    
    existing.sort(key=lambda x: x["published_at"], reverse=True)
    # Clear old list to focus on new request
    existing = existing[-50:] 
    
    with open(DATA_FILE, "w") as f:
        json.dump(existing, f, indent=2)
    
    print(f"Added {added_count} new articles. Total: {len(existing)}")
    for a in new_articles:
        print(f" - Found: {a['title']} ({a['source']})")

if __name__ == "__main__":
    all_articles = []
    
    # 1. Sources Françaises (Substack)
    sources_fr_substack = [
        ("generative", "Génération IA"),
        ("nonartificiel", "Non Artificiel"),
        ("yassinechabli", "Yassine Chabli (Productivité)"),
        ("preambule", "Préambule (Cas pratiques)"),
        ("explorationsia", "Explorations IA")
    ]
    
    for slug, name in sources_fr_substack:
        try:
            items = scrape_substack(slug, name)
            all_articles.extend(items)
        except Exception as e:
            print(f"Error {name}: {e}")
            
    # 2. Sources Françaises (Beehiiv)
    sources_fr_beehiiv = [
        ("upmynt.beehiiv.com", "Upmynt"),
        ("misteria.beehiiv.com", "Mister IA"),
        ("visionia.beehiiv.com", "Vision IA"),
        ("newsletteria.beehiiv.com", "La Newsletter IA")
    ]
    
    for slug, name in sources_fr_beehiiv:
        try:
            items = scrape_beehiiv(slug, name)
            all_articles.extend(items)
        except Exception as e:
            print(f"Error {name}: {e}")
            
    save_articles(all_articles)
