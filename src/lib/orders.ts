/**
 * Opslag van bestellingen.
 *
 * Bestellingen worden weggeschreven als JSON in .data/orders.json. Dat is
 * genoeg om de winkel te draaien en om na een bestelling de bedankpagina en de
 * bevestigingsmail te vullen, zonder dat je een database hoeft op te tuigen.
 *
 * LET OP bij publiceren op Vercel: het bestandssysteem daar is tijdelijk. Zie
 * README.md, hoofdstuk "Bestellingen bewaren", voor de stap naar een echte
 * database (bijvoorbeeld Vercel Postgres of Supabase). Alleen de vier functies
 * onderaan dit bestand hoeven dan aangepast te worden.
 */

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { CartItem, CartTotals } from './cart';
import type { CountryCode } from '@/data/site';

export type OrderStatus = 'open' | 'betaald' | 'geannuleerd' | 'mislukt';

export interface OrderCustomer {
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  addition: string;
  postalCode: string;
  city: string;
  country: CountryCode;
  phone: string;
  notes: string;
  newsletter: boolean;
}

export interface Order {
  /** Niet te raden sleutel; staat in de URL van de bedankpagina. */
  id: string;
  /** Ordernummer voor de klant en je administratie, bijvoorbeeld MEL-1042. */
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  totals: CartTotals;
  customer: OrderCustomer;
  /** Identificatie bij de betaalprovider, of 'simulatie' in testmodus zonder sleutel. */
  paymentId: string | null;
  paymentMethod: string;
  /** Verwachte bezorging, als ISO-datums. */
  deliveryFrom: string;
  deliveryTo: string;
  /** Wanneer de bevestigingsmail verstuurd is; voorkomt dubbele mails. */
  confirmationSentAt: string | null;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function readAll(): Promise<Order[]> {
  try {
    const raw = await readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

/** Schrijfacties netjes achter elkaar, zodat twee bestellingen elkaar niet overschrijven. */
let queue: Promise<unknown> = Promise.resolve();
function serialise<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task);
  queue = result.catch(() => undefined);
  return result;
}

export function generateOrderId(): string {
  return randomUUID().replace(/-/g, '').slice(0, 20);
}

/* =============================================================================
   De vier functies die de rest van de site gebruikt
   ========================================================================== */

export async function createOrder(
  order: Omit<Order, 'number' | 'createdAt' | 'status'> & { status?: OrderStatus }
): Promise<Order> {
  return serialise(async () => {
    const orders = await readAll();
    const complete: Order = {
      ...order,
      number: `MEL-${1000 + orders.length + 1}`,
      createdAt: new Date().toISOString(),
      status: order.status ?? 'open',
    };
    orders.push(complete);
    await writeAll(orders);
    return complete;
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((order) => order.id === id) ?? null;
}

export async function getOrderByPaymentId(paymentId: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((order) => order.paymentId === paymentId) ?? null;
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  return serialise(async () => {
    const orders = await readAll();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], ...patch, id: orders[index].id };
    await writeAll(orders);
    return orders[index];
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentMethod?: string
): Promise<Order | null> {
  const patch: Partial<Order> = { status };
  if (paymentMethod) patch.paymentMethod = paymentMethod;
  return updateOrder(id, patch);
}
