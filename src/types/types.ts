type ProductCard = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
};

type CartProduct = {
    id: number;
    count: number;
};

type ParamsObjGenerate = {
    [key: string]: string[];
};

export type { ProductCard, CartProduct, ParamsObjGenerate };
