export const DEV_URL = "http://localhost:8001/"

export const BASE_URL = "https://test-apid.vercel.app/"


export const DISCOUNT_PROMOS = {
    DKZ10: 10,
    DEN10: 10,
}
export const PRODUCTS = {
    "Complete Works": {
        title: "Complete Works",
        subtitle: "3-Book Bundle",
        price: "Rs. 3,100",
        max: 2,
        overview:
            "Get Musafirat (signed), Dil-e-Khwabzad, and Dard-e-Nayab in one beautiful bundle.",
        box: [
            "3 Signed Hardcovers",
            "Exclusive Bookmark Set",
        ],
        images: [
            "/assets/Dil-e-Khwabzad.PNG",
            "/assets/Musafirat_Hardcover.PNG",
            "/assets/Dard-e-Nayaab.PNG",

        ],
        ships: 'Save Rs 400 instantly',
        handcover: 'Bundle',
        description: "Get Musafirat (signed), Dil-e-Khwabzad, and Dard-e-Nayab in one beautiful bundle. "
    },

    "Musafirat": {
        title: "Musafirat",
        subtitle: "Limited 1st Edition",
        price: "Rs. 1,500",
        max: 3,
        overview:
            "A lyrical novel about loneliness, love, and finding purpose in Lahore.",
        box: [
            "Signed Copy of Musafirat (Hardcover)",
            "2 Exclusive Bookmarks",
            "Personalized Letter from Author",
        ],
        images: [
            "/assets/Musafirat_Hardcover.PNG",
            "/assets/Musafirat_Hardcover.PNG",
            "/assets/Musafirat_Hardcover.PNG",
            // Placeholder, replace if unique image exists
        ],
        description: "In the heart of Lahore, a struggling poet fights his emptiness, his rejection, his longing—for love, for purpose, for truth. Musāfirat is a lyrical novel about the journey from loneliness to connection.",
        ships: 'Max 3 copies per person. Shiping begins Dec 27th.',
        handcover: 'Literary Romance'
    },


    "Dil-e-Khwabzad": {
        title: "Dil-e-Khwabzed",
        subtitle: "9th Edition",
        price: "Rs. 1000",
        max: 3,
        overview:
            "Hardcover",
        box: [
            " Hardcover",
            " Bookmarks",
            "Personalized Letter",
        ],
        images: [
            "/assets/Dil-e-Khwabzad.PNG",

        ],
        ships: 'ships immediately',
        handcover: 'Poetry',
        description: "Dil-e-Khwabzad "
    },

    "Dard-e-nayab": {
        title: "Dard-e-nayab",
        subtitle: "3rd Edition",
        price: "Rs. 1,000",
        max: 5,
        overview: "A poetry collection exploring pain, healing, and truth.",
        box: ["Hardcover", "Rare Bookmark"],
        images: [
            "/assets/Dard-e-Nayaab.PNG",

        ],
        description: "Dard-e-nayab",
        ships: 'Edition 3 Ships now',
        handcover: 'Poetry'
    },
};