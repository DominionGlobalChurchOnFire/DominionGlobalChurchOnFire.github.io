#!/usr/bin/env python3
"""
Facebook Page Auto-Poster for Dominion Global Church On Fire

This script reads posts from posts.json and publishes them to a Facebook Page
using the Facebook Graph API. It tracks posted content to avoid duplicates.

Usage:
    python3 post_to_facebook.py

Required environment variables (set in GitHub Secrets):
    FB_PAGE_ID       - Your Facebook Page ID
    FB_ACCESS_TOKEN  - Page access token with pages_read_engagement and pages_manage_posts
"""

import json
import os
import sys
import hashlib
import requests
from datetime import datetime


# Facebook Graph API base URL
GRAPH_API = "https://graph.facebook.com/v18.0"


def load_posts(posts_file: str) -> list:
    """Load posts from the JSON file."""
    with open(posts_file, "r", encoding="utf-8") as f:
        return json.load(f)


def load_posted_ids(track_file: str) -> set:
    """Load previously posted content hashes to avoid duplicates."""
    if os.path.exists(track_file):
        with open(track_file, "r", encoding="utf-8") as f:
            return set(line.strip() for line in f if line.strip())
    return set()


def save_posted_id(track_file: str, content_hash: str) -> None:
    """Append a content hash to the tracking file."""
    with open(track_file, "a", encoding="utf-8") as f:
        f.write(content_hash + "\n")


def content_hash(post: dict) -> str:
    """Generate a unique hash for a post to track duplicates."""
    raw = f"{post.get('title', '')}|{post.get('date', '')}|{post.get('source', '')}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def build_message(post: dict) -> str:
    """Build the Facebook post message from a post object."""
    icon = post.get("icon", "🔥")
    source = post.get("source", "")
    date = post.get("date", "")
    title = post.get("title", "")
    description = post.get("description", "")

    lines = [
        f"{icon} {title}",
        "",
        description,
        "",
        f"📅 {date}",
    ]
    if source:
        lines.append(f"📌 {source}")

    lines.extend([
        "",
        "🔗 Dominion Global Church On Fire",
        "🌐 https://DominionGlobalChurchOnFire.github.io",
        "",
        "#DominionGlobalChurch #ChurchOnFire #Nigeria",
    ])

    return "\n".join(lines)


def post_to_facebook(page_id: str, access_token: str, message: str,
                     link: str = "", image_url: str = "") -> dict:
    """
    Publish a post to a Facebook Page via the Graph API.

    Returns the response JSON from Facebook.
    """
    url = f"{GRAPH_API}/{page_id}/feed"
    params = {
        "access_token": access_token,
        "message": message,
    }
    if link:
        params["link"] = link
    if image_url:
        params["url"] = image_url

    print(f"  Posting to Facebook Page {page_id}...")
    resp = requests.post(url, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def get_page_access_token(user_token: str, page_id: str) -> str:
    """
    Exchange a user access token for a page access token.
    The page token has longer lifetime and is preferred for posting.
    """
    url = f"{GRAPH_API}/{page_id}"
    params = {"fields": "access_token", "access_token": user_token}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get("access_token", user_token)


def main():
    print("=" * 60)
    print("Facebook Page Auto-Poster")
    print("Dominion Global Church On Fire")
    print("=" * 60)

    # Read configuration from environment
    page_id = os.environ.get("FB_PAGE_ID", "")
    access_token = os.environ.get("FB_ACCESS_TOKEN", "")

    if not page_id:
        print("ERROR: FB_PAGE_ID environment variable not set.")
        sys.exit(1)
    if not access_token:
        print("ERROR: FB_ACCESS_TOKEN environment variable not set.")
        sys.exit(1)

    # File paths
    posts_file = os.path.join(os.path.dirname(__file__), "..", "posts.json")
    track_file = os.path.join(os.path.dirname(__file__), "posted_ids.txt")

    # Load data
    print(f"\nLoading posts from {posts_file}...")
    posts = load_posts(posts_file)
    print(f"  Found {len(posts)} posts.")

    posted_ids = load_posted_ids(track_file)
    print(f"  Already posted: {len(posted_ids)} posts.")

    # Try to get page access token (fallback to user token if it fails)
    try:
        page_token = get_page_access_token(access_token, page_id)
        if page_token != access_token:
            print("  Using page access token for posting.")
        else:
            print("  Using user access token for posting.")
            page_token = access_token
    except Exception as e:
        print(f"  Warning: Could not get page token ({e}). Using user token.")
        page_token = access_token

    # Process each post
    new_posts = 0
    skipped = 0
    errors = 0

    for i, post in enumerate(posts):
        h = content_hash(post)

        if h in posted_ids:
            print(f"  [{i + 1}/{len(posts)}] Skipping (already posted): {post.get('title', 'N/A')[:50]}")
            skipped += 1
            continue

        message = build_message(post)
        link = post.get("url", "https://DominionGlobalChurchOnFire.github.io")

        try:
            result = post_to_facebook(page_id, page_token, message, link)
            post_id = result.get("id", "unknown")
            save_posted_id(track_file, h)
            print(f"  [{i + 1}/{len(posts)}] Posted: {post.get('title', 'N/A')[:50]} → FB post {post_id}")
            new_posts += 1
        except requests.exceptions.HTTPError as e:
            print(f"  [{i + 1}/{len(posts)}] ERROR posting: {post.get('title', 'N/A')[:50]}")
            print(f"    {e.response.text if hasattr(e, 'response') else str(e)}")
            errors += 1
        except Exception as e:
            print(f"  [{i + 1}/{len(posts)}] ERROR: {post.get('title', 'N/A')[:50]}")
            print(f"    {str(e)}")
            errors += 1

    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  New posts published: {new_posts}")
    print(f"  Skipped (already posted): {skipped}")
    print(f"  Errors: {errors}")
    print("=" * 60)

    if errors > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
