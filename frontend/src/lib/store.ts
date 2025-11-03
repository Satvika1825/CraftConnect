import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: any; // Use your Product type
  quantity: number;
}

interface StoreState {
  userRole: 'customer' | 'artisan' | 'admin' | null;
  setUserRole: (role: 'customer' | 'artisan' | 'admin' | null) => void;
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  likedProducts: string[];
  toggleLike: (productId: string) => void;
  products: any[];
  setProducts: (products: any[]) => void;
  addProduct: (product: any) => void;
  updateProduct: (id: string, updates: any) => void;
  deleteProduct: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userRole: null,
      setUserRole: (role) => {
        console.log('Setting user role to:', role);
        set({ userRole: role });
      },

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

      products: [],
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
    }
  )
);