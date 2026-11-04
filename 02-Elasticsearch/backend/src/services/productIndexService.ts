import { 
    PRODUCT_INDEX, 
    esClient, 
    initializeSearchIndex 
} from "../config/elasticsearch"

export async function indexProduct(product: any) {
    await esClient.index({
        index: PRODUCT_INDEX,

        id: String(product.id),

        document: {
            id: Number(product.id),
            name: product.name,
            description: product.description,
            category: product.category,
            price: Number(product.price),
            stock: Number(product.stock),
            created_at: product.created_at
        },
        refresh: "wait_for"
    })
}