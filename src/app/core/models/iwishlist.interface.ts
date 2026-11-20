import { Product } from './iproduct/product.interface';

export interface Iwishlist {
  status: string;
  count: number;
  data: Product[];
}
