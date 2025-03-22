import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImg;
  quantity: number;
  price: number;
};

type SelectedImg = {
  color: string;
  colorCode: string;
  image: string;
};

type CartStore = {
  cartProducts: CartProduct[];
  cartTotalAmount: number;
  cartTotalQty: number; // Add cartTotalQty to the type
  addToCart: (product: CartProduct) => void;
  removeFromCart: (product: CartProduct) => void;
  handleClearCart: () => void;
  handleQtyIncrease: (product: CartProduct) => void;
  handleQtyDecrease: (product: CartProduct) => void;
};

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartProducts: [],
      cartTotalAmount: 0,
      cartTotalQty: 0, // Initialize cartTotalQty

      addToCart: (product) => {
        const currentProducts = get().cartProducts;
        const existingProduct = currentProducts.find(
          (item) => item.id === product.id
        );

        let updatedProducts;
        if (existingProduct) {
          updatedProducts = currentProducts.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedProducts = [...currentProducts, { ...product, quantity: 1 }];
        }

        set({
          cartProducts: updatedProducts,
          cartTotalQty: updatedProducts.reduce(
            (total, item) => total + item.quantity,
            0
          ), // Recalculate total quantity
        });
      },

      removeFromCart: (product) => {
        const currentProducts = get().cartProducts;
        const updatedProducts = currentProducts.filter(
          (item) => item.id !== product.id
        );

        set({
          cartProducts: updatedProducts,
          cartTotalQty: updatedProducts.reduce(
            (total, item) => total + item.quantity,
            0
          ), // Recalculate total quantity
        });
      },

      handleClearCart: () => {
        set({ cartProducts: [], cartTotalQty: 0 }); // Reset total quantity
      },

      handleQtyIncrease: (product) => {
        const currentProducts = get().cartProducts;
        const updatedProducts = currentProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        set({
          cartProducts: updatedProducts,
          cartTotalQty: updatedProducts.reduce(
            (total, item) => total + item.quantity,
            0
          ), // Recalculate total quantity
        });
      },

      handleQtyDecrease: (product) => {
        const currentProducts = get().cartProducts;
        const updatedProducts = currentProducts.map((item) =>
          item.id === product.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        set({
          cartProducts: updatedProducts,
          cartTotalQty: updatedProducts.reduce(
            (total, item) => total + item.quantity,
            0
          ), // Recalculate total quantity
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);