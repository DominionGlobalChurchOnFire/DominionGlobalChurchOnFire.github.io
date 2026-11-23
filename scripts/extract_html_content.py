#!/usr/bin/env python3
"""
HTML Content Extractor for Dominion Global Church On Fire

This script extracts events, services, and key content from the sample HTML
pages and generates/updates posts.json with the extracted data.

Usage:
    python3 extract_html_content.py

Output:
    posts.json - Updated with content extracted from all sample HTML files
"""

import json
import os
import re
import glob
from datetime import datetime


def extract_config_from_html(html_file: str) -> dict:
    """Extract the JavaScript config object from an HTML file."""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Look for the config object in script tags
    config_match = re.search(
        r'const\s+config\s*=\s*({.*?});',
        content,
        re.DOTALL
    )

    if not config_match:
        return {}

    config_str = config_match.group(1)

    # Parse the config object (simple JSON-like parsing)
    try:
        # Convert JS object to JSON-compatible format
        config_str = config_str.replace("'", '"')
        config_str = re.sub(r'(\w+):\s*"', r'"\1": "', config_str)
        config = json.loads(config_str)
        return config
    except json.JSONDecodeError:
        return {}


def extract_events_from_html(html_file: str) -> list:
    """Extract events section content from HTML."""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    events = []

    # Look for event cards/sections
    event_pattern = re.findall(
        r'<div\s+class=["\'](?:event|service|card)["\'][^>]*>(.*?)</div>',
        content,
        re.DOTALL
    )

    for event_html in event_pattern:
        # Extract title
        title_match = re.search(r'<(?:h\d|strong)[^>]*>(.*?)</(?:h\d|strong)>', event_html)
        # Extract date
        date_match = re.search(r'(?:\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4})', event_html)
        # Extract description
        desc_match = re.search(r'<(?:p|span)[^>]*>(.*?)</(?:p|span)>', event_html)

        if title_match:
            events.append({
                "title": title_match.group(1).strip(),
                "date": date_match.group(1).strip() if date_match else "",
                "description": desc_match.group(1).strip() if desc_match else "",
            })

    return events


def extract_sections_from_html(html_file: str) -> list:
    """Extract section content from HTML by looking for common patterns."""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    sections = []

    # Extract section titles and content
    section_pattern = re.findall(
        r'<section[^>]*id=["\']([^"\']*)["\'][^>]*>(.*?)</section>',
        content,
        re.DOTALL
    )

    for section_id, section_html in section_pattern:
        # Clean HTML tags
        clean_text = re.sub(r'<[^>]+>', ' ', section_html)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        if len(clean_text) > 50:  # Only include substantial content
            sections.append({
                "section_id": section_id,
                "content": clean_text[:500],
            })

    return sections


def extract_service_times(html_file: str) -> list:
    """Extract service times from HTML."""
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    services = []

    # Look for service time patterns
    service_pattern = re.findall(
        r'(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)[^<]*?(?:\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))',
        content
    )

    for service in service_pattern:
        services.append(service.strip())

    return services


def generate_posts_from_html(samples_dir: str, existing_posts: list) -> list:
    """
    Generate posts from all sample HTML files.
    Merges with existing posts, avoiding duplicates.
    """
    existing_titles = {p.get("title", "").lower() for p in existing_posts}
    new_posts = []

    html_files = sorted(glob.glob(os.path.join(samples_dir, "sample-*.html")))

    icons = {
        "service": "📖",
        "event": "📅",
        "ministry": "⛪",
        "prayer": "🙏",
        "worship": "🎶",
        "history": "🏠",
        "default": "🔥",
    }

    for html_file in html_files:
        filename = os.path.basename(html_file)
        print(f"  Processing {filename}...")

        # Extract events
        events = extract_events_from_html(html_file)
        for event in events:
            title_lower = event["title"].lower()
            if title_lower not in existing_titles:
                # Determine icon based on content
                icon = icons["default"]
                if any(w in title_lower for w in ["service", "sunday"]):
                    icon = icons["service"]
                elif any(w in title_lower for w in ["prayer"]):
                    icon = icons["prayer"]
                elif any(w in title_lower for w in ["worship", "music"]):
                    icon = icons["worship"]
                elif any(w in title_lower for w in ["history", "headquarters"]):
                    icon = icons["history"]

                new_posts.append({
                    "icon": icon,
                    "source": "Website",
                    "date": event.get("date", datetime.now().strftime("%B %Y")),
                    "title": event["title"],
                    "description": event.get("description", ""),
                    "url": f"https://DominionGlobalChurchOnFire.github.io/{filename}",
                })
                existing_titles.add(title_lower)

        # Extract service times
        services = extract_service_times(html_file)
        for service in services:
            if service.lower() not in existing_titles:
                new_posts.append({
                    "icon": icons["service"],
                    "source": "Service Times",
                    "date": datetime.now().strftime("%B %Y"),
                    "title": service,
                    "description": f"Join us for {service} at Dominion Global Church On Fire.",
                    "url": f"https://DominionGlobalChurchOnFire.github.io/{filename}",
                })
                existing_titles.add(service.lower())

    return new_posts


def main():
    print("=" * 60)
    print("HTML Content Extractor")
    print("Dominion Global Church On Fire")
    print("=" * 60)

    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    samples_dir = os.path.join(repo_root, "Samples")
    posts_file = os.path.join(repo_root, "posts.json")

    # Load existing posts
    print(f"\nLoading existing posts from {posts_file}...")
    if os.path.exists(posts_file):
        with open(posts_file, "r", encoding="utf-8") as f:
            existing_posts = json.load(f)
        print(f"  Found {len(existing_posts)} existing posts.")
    else:
        existing_posts = []
        print("  No existing posts found.")

    # Generate new posts from HTML
    print(f"\nExtracting content from {samples_dir}...")
    new_posts = generate_posts_from_html(samples_dir, existing_posts)
    print(f"  Found {len(new_posts)} new posts from HTML files.")

    # Combine and save
    all_posts = existing_posts + new_posts

    # Limit to 20 posts max
    if len(all_posts) > 20:
        all_posts = all_posts[:20]

    with open(posts_file, "w", encoding="utf-8") as f:
        json.dump(all_posts, f, indent=2, ensure_ascii=False)

    print(f"\nSaved {len(all_posts)} posts to {posts_file}")
    print("=" * 60)


if __name__ == "__main__":
    main()
