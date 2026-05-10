# Fixy: Curation Engine for Toddler Obsessions

Fixy automates the discovery of high-quality toys, books, and local events for parents of toddlers (ages 2-4) during hyper-fixation shifts.

## Data Infrastructure
The data infrastructure is distributed across four core databases to handle discovery logic, e-commerce, and real-time interest pivot detection.

### 1. Interest Directory (`fixy_directory`)
- **ID:** `e5e2c0c2-81dc-4ce5-ac7a-857b090b07de`
- **Purpose:** Maps specific child interests to structured search parameters and educational facts.
- **Schema:** `interest_name`, `category`, `amazon_product_refs`, `local_event_query_terms`, `fact_card`, `last_updated`

### 2. Bundle Catalog (`fixy_bundles`)
- **ID:** `abe2b04f-6350-4a09-9771-df4dd02442cf`
- **Purpose:** Defines the content for the $49 Standard and $99 Premium "Interest Bundles".
- **Schema:** `interest_name`, `tier`, `price_cents`, `description`, `includes_list`, `image_url`

### 3. Search Analytics (`fixy_search_analytics`)
- **ID:** `1eac6a89-1d34-4059-8124-6825ba7f00b8`
- **Purpose:** Logs parent queries to detect emerging "Interest Pivots" and prioritize data mapping.
- **Schema:** `query`, `found_match`, `timestamp`, `session_id`

### 4. Waitlist (`9cc90250-0596-4b4d-b2a1-f06e9b20db06`)
- **Purpose:** Lead capture and beta onboarding.

## Technical Integration
The frontend uses the `DIRECTORY_DB_ID` to hydrate the search dashboard and the `ANALYTICS_DB_ID` to log user intent. All databases are managed via the Baget Agent Database API.

---
*Last Updated: May 10, 2026*
