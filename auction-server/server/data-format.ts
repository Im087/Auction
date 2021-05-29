export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  desc: string;
  category: string[];
}

export interface Comment {
  id: number;
  productId: number;
  timeStamp: string;
  user: string;
  rating: number;
  content: string;
}
