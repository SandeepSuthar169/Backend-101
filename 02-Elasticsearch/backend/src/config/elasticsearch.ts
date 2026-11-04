import { Client } from "@elastic/elasticsearch";  
import dotenv from "dotenv";

dotenv.config();

export const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200"
})

export const PRODUCT_INDEX = process.env.ELASTICSEARCH_INDEX || "products"

export const  initializeSearchIndex = async () => {
    const exists = await esClient.indices.exists({
        index: PRODUCT_INDEX
    })

    if(!exists) {
        await esClient.indices.create({
            index: PRODUCT_INDEX,

            mappings: {
                properties: {
                    // ------ ID -------
                    id: {
                        type: "integer"
                    },
                    // ------ NAME -------
                    name: {
                        type: "text",
                        fields: {
                            keyword: {
                                type: "keyword"
                            }
                        }
                    },
                    // ------ DESCRIPTION -------
                    description: {
                        type: "text"
                    },
                    //-------- CATEGORY --------
                    category: {
                        type: "text",
                        fields: {
                            keyword: {
                                type: "keyword"
                            }
                        }
                    },
                    //-------- PRICE ---------
                    price: {
                        type: "float"
                    },
                    //-------- STICK ---------
                    stock: {
                        type: "integer"
                    },
                    //-------- CREATED_AT ---------
                    created_at: {
                        type: "date"
                    }
                }
            }
        })
    }
}