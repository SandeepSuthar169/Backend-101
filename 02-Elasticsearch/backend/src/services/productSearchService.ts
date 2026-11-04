import {
    PRODUCT_INDEX,
    esClient,
    initializeSearchIndex
} from "../config/elasticsearch"

interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
}

export async function searchProducts(seatchText:string) {
    const result = await esClient.search<Product>({
        index: PRODUCT_INDEX,
        
        query: {                    // query: Search text entered by the user.
            multi_match: {          // multi_match: Searches multiple fields.
                query: seatchText,

                fields: [
                    "name^3",            // name^3: Gives the product name higher relevance.
                    "category^2",        // category^2: Gives the category the next priority.
                    "description"        // description: Also searches product descriptions.
                ],
                fuzziness: "AUTO"       // fuzziness: Helps match minor spelling mistakes.
            }
        },
        sort: [
            { _score: { order: "desc" }},
            { id: { order: "desc" }}
        ],
        size: 50
    })

    return result.hits.hits.map((hit) => ({
        ...hit._source ?? {},                      // - hits: Contains matching product documents.
        score: hit._score
    }))
}