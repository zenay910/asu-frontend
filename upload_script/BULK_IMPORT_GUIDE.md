# Bulk Import Script Guide

This script imports appliance items and their associated metadata into a Supabase database from a CSV file.

## Prerequisites

Before running the script, ensure you have:
- Node.js 18 or higher
- The required npm packages installed:
  ```bash
  npm i @supabase/supabase-js csv-parse dotenv
  ```

## Environment Setup

Create a `.env` file in the `upload_script` directory with the following variables:

```
SUPABASE_URL=https://YOURPROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   (never commit this to version control)
BUCKET=appliances
```

**Important:** The service role key is sensitive. Never commit this file to git or share it publicly.

## Running the Script

```bash
node bulk_import.mjs <path_to_items.csv> <path_to_photos_folder>
```

### Example
```bash
node bulk_import.mjs ./items.csv ./photos
```

## CSV Format

The CSV file should include the following headers (all optional except `title`):

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| title | string | Yes | Item name |
| brand | string | No | Manufacturer name |
| price | number | No | Can include currency symbols |
| model_number | string | No | Model identifier |
| category | enum | No | Must be: `Washer`, `Dryer`, or `Stove` |
| configuration | string | No | E.g., "Front Load", "Top Load", "Stacked Unit", "Standard", "Slide-In", "Cooktop" |
| dimensions | JSON | No | Format: `{"width":27,"height":38,"depth":31}` |
| capacity | number | No | Numeric value (units will vary) |
| fuel | enum | No | Must be: `Electric`, `Gas`, or empty |
| unit_type | enum | No | Must be: `Individual` or `Set` |
| color | string | No | Item color |
| features | string/JSON | No | Can be comma/pipe/semicolon-separated list OR JSON array |
| condition | enum | No | Must be: `New`, `Good`, `Fair`, or `Poor` |
| status | enum | No | Must be: `Draft`, `Published`, or `Archived` (defaults to `Draft`) |
| description_long | string | No | Detailed product description |

### Example CSV Row
```
title,brand,price,category,condition,status
Front Load Washer,LG,"$1,299.99",Washer,Good,Published
```

## Optional Features

### Photos Folder Structure
While image upload is currently disabled in the script, the folder structure is:
```
photos/
  <TITLE>/
    1.jpg
    2.png
    cover.jpg
```

The script will preferentially use files named with `1.` or containing "cover" as the cover image.

To enable photo uploads in the future, uncomment the image upload section in the script (lines containing the photo folder logic).

## What the Script Does

1. **Reads the CSV file** and parses it
2. **Validates data** against allowed enum values
3. **Inserts/updates items** in the Supabase `items` table
4. **Logs progress** with checkmarks for successful imports and errors for failures
5. **Reports any issues** with specific rows (invalid enums, missing data, etc.)

## Output

The script will display:
- Total number of rows to import
- Path to the CSV file and photos folder
- A checkmark (✓) for each successfully imported item
- Error messages for any rows that fail
- A final "All done" message

## Troubleshooting

**"CSV not found"** - Check the path to your CSV file is correct and the file exists.

**"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"** - Ensure your `.env` file is in the `upload_script` directory with both required variables.

**"Invalid [field]"** - The CSV contains a value that doesn't match the allowed options. Check the enum values in the table above.

**"Missing title"** - A row in your CSV doesn't have a title. Title is required and skipped rows will be logged.

## Notes

- Unknown columns in the CSV are silently ignored
- Whitespace is automatically trimmed from values
- Empty or null fields are handled gracefully
- Price values are cleaned of currency symbols
- Photo upload functionality is currently commented out and needs to be re-enabled when a new image organization strategy is determined
