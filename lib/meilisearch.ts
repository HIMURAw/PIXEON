import { Meilisearch } from "meilisearch";

const host = process.env.MEILISEARCH_HOST || "http://127.0.0.1:7700";
const apiKey = process.env.MEILISEARCH_API_KEY || "";

export const meiliClient = new Meilisearch({
  host,
  apiKey,
});

export const MEILI_PRODUCTS_INDEX = "products";
