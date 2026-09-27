# Athens Music Technology Forum (AMTF)

Static website for [amtf.gr](https://www.amtf.gr) — the Athens Music Technology Forum.

## Development

This is a hand-written HTML site deployed on Vercel.

### Sitemap Maintenance

When updating page content, remember to update the `<lastmod>` date in `sitemap.xml` for that page. Use the date of the change in `YYYY-MM-DD` format.

The sitemap should only include live, indexable pages (not redirecting URLs like `/forum-2026`). Currently indexed pages:

- `/` (index.html)
- `/forum-2027` (forum-2027.html)
- `/organising-team` (organising-team.html)
- `/about` (about.html)
- `/forum-2025` (forum-2025.html)
- `/gallery` (gallery.html)
- `/contact` (contact.html)

### URL Redirects

URL redirects are configured in `vercel.json`. When adding new redirects (e.g., for past forum editions), ensure the old URL is **not** in the sitemap.
