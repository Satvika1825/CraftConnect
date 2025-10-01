import { Product } from '@/types';
import pottery from '@/assets/pottery.jpg';
import weaving from '@/assets/weaving.jpg';
import embroidery from '@/assets/embroidery.jpg';
import woodwork from '@/assets/woodwork.jpg';
import jewelry from '@/assets/jewelry.jpg';
import painting from '@/assets/painting.jpg';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handcrafted Terracotta Vase',
    description: 'Beautiful traditional terracotta vase with intricate designs, perfect for home decor.',
    price: 899,
    category: 'Pottery',
    stock: 15,
    image: pottery,
    artisanId: 'artisan1',
    artisanName: 'Rajesh Kumar',
    approved: true,
  },
  {
    id: '2',
    name: 'Handwoven Cotton Saree',
    description: 'Authentic handloom saree with traditional patterns, woven with love and care.',
    price: 2499,
    category: 'Weaving',
    stock: 8,
    image: weaving,
    artisanId: 'artisan2',
    artisanName: 'Lakshmi Devi',
    approved: true,
  },
  {
    id: '3',
    name: 'Embroidered Wall Hanging',
    description: 'Stunning embroidered wall art depicting traditional motifs and vibrant colors.',
    price: 1299,
    category: 'Embroidery',
    stock: 12,
    image: embroidery,
    artisanId: 'artisan3',
    artisanName: 'Meera Sharma',
    approved: true,
  },
  {
    id: '4',
    name: 'Carved Wooden Box',
    description: 'Intricately carved wooden jewelry box with traditional Indian patterns.',
    price: 1599,
    category: 'Woodwork',
    stock: 10,
    image: woodwork,
    artisanId: 'artisan4',
    artisanName: 'Suresh Patel',
    approved: true,
  },
  {
    id: '5',
    name: 'Traditional Kundan Necklace',
    description: 'Handmade Kundan jewelry set with authentic gemstones and gold plating.',
    price: 3499,
    category: 'Jewelry',
    stock: 5,
    image: jewelry,
    artisanId: 'artisan5',
    artisanName: 'Anita Singh',
    approved: true,
  },
  {
    id: '6',
    name: 'Madhubani Folk Art',
    description: 'Authentic Madhubani painting on handmade paper, depicting traditional themes.',
    price: 1899,
    category: 'Painting',
    stock: 7,
    image: painting,
    artisanId: 'artisan6',
    artisanName: 'Priya Mishra',
    approved: true,
  },
];
