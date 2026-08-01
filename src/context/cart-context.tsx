'use client';

/**
 * De winkelmand.
 *
 * Bewust klein gehouden: React Context met een reducer, meer is het niet. De
 * inhoud wordt in localStorage bewaard, zodat de mand een herlaadbeurt en het
 * sluiten van de browser overleeft.
 *
 * Bedragen zijn altijd hele centen; het rekenwerk staat in src/lib/cart.ts,
 * zodat de server bij het afrekenen exact dezelfde bedragen uitrekent.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { calculateTotals, cartItemId, countItems, type CartItem, type CartTotals } from '@/lib/cart';
import { COLORS, type ColorSlug, type Product, type Size } from '@/data/products';
import type { CountryCode } from '@/data/site';

const STORAGE_KEY = 'melin-clo-winkelmand-v1';

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  /** Wordt pas true nadat localStorage gelezen is; voorkomt flikkeren van het aantal. */
  hydrated: boolean;
}

type CartAction =
  | { type: 'hydrate'; payload: { items: CartItem[]; discountCode: string | null } }
  | { type: 'add'; payload: { item: CartItem; maxQuantity: number } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'setQuantity'; payload: { id: string; quantity: number } }
  | { type: 'setDiscount'; payload: { code: string | null } }
  | { type: 'clear' };

const initialState: CartState = { items: [], discountCode: null, hydrated: false };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true };

    case 'add': {
      const { item, maxQuantity } = action.payload;
      const existing = state.items.find((line) => line.id === item.id);

      if (!existing) {
        return { ...state, items: [...state.items, item] };
      }

      return {
        ...state,
        items: state.items.map((line) =>
          line.id === item.id
            ? { ...line, quantity: Math.min(line.quantity + item.quantity, maxQuantity) }
            : line
        ),
      };
    }

    case 'remove':
      return { ...state, items: state.items.filter((line) => line.id !== action.payload.id) };

    case 'setQuantity': {
      if (action.payload.quantity < 1) {
        return { ...state, items: state.items.filter((line) => line.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((line) =>
          line.id === action.payload.id ? { ...line, quantity: action.payload.quantity } : line
        ),
      };
    }

    case 'setDiscount':
      return { ...state, discountCode: action.payload.code };

    case 'clear':
      return { ...state, items: [], discountCode: null };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totals: CartTotals;
  discountCode: string | null;
  hydrated: boolean;
  /** Laatste melding, voorgelezen door schermlezers via aria-live. */
  announcement: string;
  drawerOpen: boolean;
  addItem: (product: Product, color: ColorSlug, size: Size, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  applyDiscount: (code: string | null) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCountry: (country: CountryCode) => void;
  country: CountryCode;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [country, setCountry] = useState<CountryCode>('NL');
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inlezen bij het opstarten.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; discountCode?: string | null };
        dispatch({
          type: 'hydrate',
          payload: {
            items: Array.isArray(parsed.items) ? parsed.items : [],
            discountCode: parsed.discountCode ?? null,
          },
        });
        return;
      }
    } catch {
      // Kapotte of geblokkeerde opslag mag de winkel niet stukmaken.
    }
    dispatch({ type: 'hydrate', payload: { items: [], discountCode: null } });
  }, []);

  // Wegschrijven bij elke wijziging.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, discountCode: state.discountCode })
      );
    } catch {
      // Bijvoorbeeld privémodus met volle opslag: negeren.
    }
  }, [state.items, state.discountCode, state.hydrated]);

  useEffect(() => {
    return () => {
      if (announceTimer.current) clearTimeout(announceTimer.current);
    };
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    if (announceTimer.current) clearTimeout(announceTimer.current);
    announceTimer.current = setTimeout(() => setAnnouncement(''), 6000);
  }, []);

  const addItem = useCallback(
    (product: Product, color: ColorSlug, size: Size, quantity = 1) => {
      const variant = product.variants.find((v) => v.color === color && v.size === size);
      if (!variant || variant.stock === 0) return;

      const image = product.images[0];
      const item: CartItem = {
        id: cartItemId(product.slug, color, size),
        slug: product.slug,
        name: product.name,
        color,
        colorLabel: COLORS[color].label,
        size,
        price: product.price,
        quantity,
        image: image?.src ?? '',
        imageAlt: image?.alt ?? product.name,
        sku: variant.sku,
      };

      dispatch({ type: 'add', payload: { item, maxQuantity: variant.stock } });
      announce(
        `${product.name} in ${COLORS[color].label.toLowerCase()}, maat ${size} is toegevoegd aan je winkelmand.`
      );
      setDrawerOpen(true);
    },
    [announce]
  );

  const removeItem = useCallback(
    (id: string) => {
      const item = state.items.find((line) => line.id === id);
      dispatch({ type: 'remove', payload: { id } });
      if (item) announce(`${item.name}, maat ${item.size} is uit je winkelmand gehaald.`);
    },
    [announce, state.items]
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      dispatch({ type: 'setQuantity', payload: { id, quantity } });
      const item = state.items.find((line) => line.id === id);
      if (item && quantity >= 1) {
        announce(`Aantal van ${item.name}, maat ${item.size} is nu ${quantity}.`);
      }
    },
    [announce, state.items]
  );

  const applyDiscount = useCallback((code: string | null) => {
    dispatch({ type: 'setDiscount', payload: { code } });
  }, []);

  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const totals = useMemo(
    () => calculateTotals(state.items, { country, discountCode: state.discountCode }),
    [state.items, state.discountCode, country]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: countItems(state.items),
      totals,
      discountCode: state.discountCode,
      hydrated: state.hydrated,
      announcement,
      drawerOpen,
      addItem,
      removeItem,
      setQuantity,
      applyDiscount,
      clear,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      country,
      setCountry,
    }),
    [
      state.items,
      state.discountCode,
      state.hydrated,
      totals,
      announcement,
      drawerOpen,
      addItem,
      removeItem,
      setQuantity,
      applyDiscount,
      clear,
      country,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart moet binnen een CartProvider gebruikt worden.');
  }
  return context;
}
