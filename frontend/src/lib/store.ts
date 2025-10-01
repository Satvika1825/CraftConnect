import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, UserRole } from '@/types';

interface StoreState {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  likedProducts: string[];
  toggleLike: (productId: string) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

// Initialize store with mock data
import { mockProducts } from './mockData';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userRole: null,
      setUserRole: (role) => set({ userRole: role }),
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      likedProducts: [],
      toggleLike: (productId) =>
        set((state) => ({
          likedProducts: state.likedProducts.includes(productId)
            ? state.likedProducts.filter((id) => id !== productId)
            : [...state.likedProducts, productId],
        })),
      products: mockProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'craftconnect-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.products.length === 0) {
          state.setProducts(mockProducts);
        }
      },
    }
  )
);
