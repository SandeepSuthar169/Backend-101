import {
  esClient,
  PRODUCT_INDEX
} from "../config/elasticsearch.js";

export async function searchProducts(searchText: string) {

  const result = await esClient.search({

    index: PRODUCT_INDEX,

    query: {

      multi_match: {

        query: searchText,

        fields: [
          "name^3",
          "category^2",
          "description"
        ],

        fuzziness: "AUTO"
      }

    },

    sort: [
      { _score: { order: "desc" } },
      { id: { order: "desc" } }
    ],

    size: 50

  })

    return result.hits.hits.map((hit) => ({
        ...hit._source ?? {},                      // - hits: Contains matching product documents.
        score: hit._score
    }))
}