# Facebook Page Full Automation Setup Guide

## Overview

This guide explains how to set up **full automation** between your church website and a Facebook Page. The system works in two directions:

1. **Website → Facebook**: Content from your HTML pages is automatically posted to your Facebook Page
2. **Facebook → Website**: Posts from your Facebook Page are automatically synced to your website

---

## ⚠️ Important: Your Facebook Profile vs. Facebook Page

Your current Facebook account is a **personal profile**:
- **Profile URL:** `https://www.facebook.com/profile.php?id=61595244482632`
- **Profile ID:** `61595244482632`

**This profile cannot be used for automated posting.** Facebook's Graph API only works with **Facebook Pages**, not personal profiles. You need to create a Facebook Page using this profile as the admin account.

Your personal profile (`61595244482632`) will be the **admin** that manages the Page, but the automation will post to the **Page**, not your profile.

---

## Current Setup (Working Now)

- ✅ `posts.json` — Contains 12 posts at the repository root
- ✅ `cdn/js/load-posts.js` — JavaScript that loads and renders posts dynamically
- ✅ All 5 sample HTML files updated to use dynamic loading
- ✅ `scripts/post_to_facebook.py` — Posts content to Facebook Page
- ✅ `scripts/extract_html_content.py` — Extracts content from HTML pages
- ✅ `.github/workflows/post-to-facebook.yml` — Auto-posts to Facebook Page
- ✅ `.github/workflows/update-facebook-posts.yml` — Syncs Facebook posts to website

---

## Step 1: Create a Facebook Page

**Important:** Facebook's Graph API works with **Pages**, not Groups or personal profiles. Your current posts reference a Facebook Group (`798617002450170`), but Groups are not supported by the API (Meta disabled Group API access in 2024). You **must** create a Facebook Page.

### How to Create Your Facebook Page

1. **Log in** to Facebook at https://www.facebook.com/ using your profile (`61595244482632`)
2. Go to https://www.facebook.com/pages/create/
3. Choose **"Community"** or **"Brand or Business"** as the page type
4. Enter your page details:
   - **Page name:** `Dominion Global Church On Fire`
   - **Category:** `Church` or `Religious Institution`
   - **Description:** `Dominion Global Church On Fire — A welcoming place of worship, fellowship, and spiritual growth. Headquarters: Dominion Villa, Area 1, Garki, Abuja, Nigeria.`
5. Upload a profile picture (use your church logo from `cdn/files/uploads/10469550/FavIcon.png`)
6. Upload a cover photo
7. Click **"Create Page"**

### After Creating the Page

1. Add your church's address, service times, and contact info
2. Invite members from your Facebook Group to follow the Page
3. Start posting your church events and updates on the Page
4. Cross-post important Group content to the Page

---

## Step 2: Get Your Facebook Page ID

After creating the Page, you need its **Page ID** (this will be different from your profile ID `61595244482632`).

1. Go to your new Facebook Page
2. Look at the URL — it will show something like `facebook.com/pages/Dominion-Global-Church-On-Fire/123456789`
3. The number at the end is your **Page ID**
4. Alternatively, use https://findidfb.com/ and search for your page name
5. **Save this number** — you'll need it for GitHub Secrets

**Note:** Your Page ID will be a different number than your profile ID (`61595244482632`). The Page ID is what the automation uses.

---

## Step 3: Create a Meta Developer App

1. Go to https://developers.facebook.com/ and **log in with your Facebook profile** (`61595244482632`)
2. Click **"My Apps"** → **"Add a New App"**
3. Choose **"Business"** as the app type
4. Give your app a name (e.g., "Church Website Automation")
5. Click **"Create App"**
6. In the App Dashboard, go to **"Settings"** → **"Basic"**
7. Note your **App ID** and **App Secret**

### Add the Facebook Pages API

1. In your App Dashboard, click **"Add a Product"** → **"Facebook Login"**
2. Set up Facebook Login for **Web** (add `https://DominionGlobalChurchOnFire.github.io` as OAuth redirect URI)
3. Go to **"Roles"** and add any admins who need access

---

## Step 4: Get Your Access Token

You need a **Page Access Token** with posting permissions.

### Option A: Using Meta Developer Tools (Quick)

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app from the dropdown
3. Click **"Get Token"** → **"Get User Access Token"**
4. Select these permissions:
   - `pages_read_engagement` — Read posts from your Page
   - `pages_manage_posts` — Publish posts to your Page
   - `pages_show_list` — List pages you manage
   - `public_profile` — Basic profile access
5. Click **"Generate Token"**
6. To get the Page token, go to:
   `https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN`
7. Find your page in the results and copy its `access_token`

### Option B: Using the Graph API Directly

```bash
# Get user token with permissions
# Then exchange for page token:
curl -G "https://graph.facebook.com/v18.0/me/accounts" \
  -d "access_token=YOUR_USER_TOKEN"
```

**Important:** Use the **Page Access Token** (not the user token) for the GitHub Secret. Page tokens don't expire.

---

## Step 5: Add GitHub Secrets

1. Go to your GitHub repository: `DominionGlobalChurchOnFire.github.io`
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"** and add:

| Secret Name | Value | Description |
|---|---|---|
| `FB_PAGE_ID` | Your Facebook Page ID (e.g., `123456789`) | Numeric Page ID |
| `FB_ACCESS_TOKEN` | Your Page Access Token | Long-lived token with posting permissions |

---

## Step 6: Test the Workflows

### Test Posting to Facebook

1. Go to **"Actions"** tab in your repository
2. Select **"Auto Post to Facebook Page"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Check the logs — your posts from `posts.json` should appear on your Facebook Page

### Test Syncing from Facebook

1. Go to **"Actions"** tab in your repository
2. Select **"Update Facebook Posts"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Check the logs — posts from your Facebook Page should update `posts.json`

---

## How the Full Automation Works

### Direction 1: Website → Facebook (post-to-facebook.yml)

1. **Triggers:** Daily at 8:00 AM UTC, on manual trigger, or when HTML files change
2. `scripts/extract_html_content.py` reads all 5 sample HTML pages
3. Extracts events, services, and content → updates `posts.json`
4. `scripts/post_to_facebook.py` reads `posts.json` and posts new content to Facebook
5. Duplicate tracking prevents posting the same content twice
6. Updated `posts.json` is committed back to the repository

### Direction 2: Facebook → Website (update-facebook-posts.yml)

1. **Triggers:** Every 6 hours or on manual trigger
2. Fetches the latest 12 posts from your Facebook Page via Graph API
3. Python parses the posts and creates a new `posts.json`
4. If the posts have changed, it commits and pushes the update
5. GitHub Pages rebuilds your site with the new posts
6. All 5 sample pages show the updated posts automatically

---

## Manual Post Updates

If you prefer to update posts manually (without the Facebook API):

1. Edit `posts.json` in your repository
2. Add or modify post entries with this format:

```json
{
  "icon": "🔥",
  "source": "Sunday Service",
  "date": "November 21, 2026",
  "title": "Your Post Title",
  "description": "Your post description here...",
  "url": "https://www.facebook.com/DominionGlobalChurchOnFire/posts/POST_ID"
}
```

3. Commit and push — all 5 sample pages will show the new posts immediately
4. The next workflow run will also post this to your Facebook Page

---

## File Structure

```
DominionGlobalChurchOnFire.github.io/
├── posts.json                    ← Post data (auto-updated by both workflows)
├── cdn/js/load-posts.js          ← Dynamic post loader for website
├── scripts/
│   ├── post_to_facebook.py       ← Posts content TO Facebook Page
│   ├── extract_html_content.py   ← Extracts content FROM HTML pages
│   └── posted_ids.txt            ← Tracks posted content (auto-generated)
├── Samples/
│   ├── sample-1.html             ← Church website page 1
│   ├── sample-2.html             ← Church website page 2
│   ├── sample-3.html             ← Church website page 3
│   ├── sample-4.html             ← Church website page 4
│   └── sample-5.html             ← Church website page 5
└── .github/workflows/
    ├── post-to-facebook.yml      ← Website → Facebook automation
    └── update-facebook-posts.yml ← Facebook → Website automation
```

---

## Post Format on Facebook

When content is posted to your Facebook Page, it appears as:

```
🔥 Church Headquarters — Dominion Villa, Abuja

On 2nd December 1989, the Church was officially inaugurated at the old parade ground Abuja...

📅 December 2025
📌 Church History

🔗 Dominion Global Church On Fire
🌐 https://DominionGlobalChurchOnFire.github.io

#DominionGlobalChurch #ChurchOnFire #Nigeria
```

---

## Troubleshooting

- **Posts not showing on website?** Check browser console for errors loading `posts.json`
- **GitHub Action failing?** Verify your secrets are set correctly in GitHub Settings
- **Token expired?** Facebook Page Access Tokens don't expire, but user tokens do — regenerate if needed
- **Posts not appearing on Facebook?** Check the workflow logs for API errors; verify `pages_manage_posts` permission
- **Duplicate posts?** The `posted_ids.txt` file tracks what's been posted — delete it to re-post all content
- **Group posts not available?** Use a Facebook Page instead (Groups are not supported by the API)
- **Workflow not triggering?** Check that the workflow is enabled in Settings → Actions → General → Actions permissions
