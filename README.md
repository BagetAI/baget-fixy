# Fixy: Curation Engine for Toddler Obsessions

Fixy automates the discovery of high-quality toys, books, and local events for parents of toddlers (ages 2-4) during hyper-fixation shifts.

## Data Infrastructure
The `fixy_directory` database serves as the core discovery logic, mapping specific child interests to structured search parameters for the Amazon PA-API 5.0 and SerpApi (Google Events).

- **Database ID:** `e5e2c0c2-81dc-4ce5-ac7a-857b090b07de`
- **Public Read Access:** Enabled (for frontend listing generation)
- **Primary Schema:** `interest_name`, `category`, `amazon_product_refs`, `local_event_query_terms`, `last_updated`

## Seeded Interests
The initial deployment includes 10 high-intent categories:
1. Garbage Trucks
2. Honey Bees
3. Excavators
4. The Moon
5. Ankylosaurus
6. Steam Engines
7. Whales
8. Firefighting
9. Ant Colonies
10. Tornadoes
