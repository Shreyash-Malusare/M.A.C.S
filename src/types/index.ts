export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: 'men' | 'women' | 'kids' | 'unisex' | 'accessories' | 'sports' | 'beauty';
  description: string;
  isNew?: boolean;
}

export interface CartItem {
  _id: string;
  productId: Product; // Ensure this matches your backend schema
  quantity: number;
  size?: string; // Optional if you're using sizes
  userId?: string; // Optional if you're managing user-specific carts
}
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}
