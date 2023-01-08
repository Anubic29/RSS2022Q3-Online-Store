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

type CatalogProductCardFunctions = {
    [key: string]: () => void | Promise<void>;
};

type CartProduct = {
    id: number;
    count: number;
    finalPrice: number;
};

type ParamsObjGenerate = {
    [key: string]: string[];
};

type promoObj = {
    id: string;
    name: string;
    disc: number;
};

type soldProducts = {
    id: number;
    sold: number;
};

export type { ProductCard, CartProduct, ParamsObjGenerate, promoObj, soldProducts, CatalogProductCardFunctions };
