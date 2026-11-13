# Article Feed Guidance

- Beefy articles dated 1 March 2024 or later are imported automatically by `app/api/beefy-articles/route.ts` and shown on the Articles page.
- Do not add individual historical Beefy articles from this date range to the frontend manually; that creates duplicate entries.
- Keep the import cutoff at 1 March 2024. Do not add older Beefy archive articles or move the cutoff earlier unless explicitly requested.
- When a new Beefy article is missing, fix or refresh the feed integration instead of adding a one-off article entry.
