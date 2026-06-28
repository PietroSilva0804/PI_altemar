'use client';

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import type { Product } from './placeholder-data';

export type ProductType = 'Novo' | 'Usado' | 'Serviço';

export interface SellerProduct extends Product {
  sellerId: string;
  stock: number;
  type: ProductType;
  source: 'firestore';
}

export interface NewProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  type: ProductType;
  stock: number;
  imageUrl?: string;
  storeName: string;
}

const productsCollection = collection(db, 'products');

function buildImageUrl(name: string, custom?: string) {
  if (custom && custom.trim()) return custom.trim();
  const seed = encodeURIComponent(name.slice(0, 20) || 'produto');
  return `https://picsum.photos/seed/${seed}/600/400`;
}

function mapDoc(id: string, data: Record<string, unknown>): SellerProduct {
  const name = (data.name as string) ?? 'Produto';
  const imageUrl = (data.imageUrl as string) || buildImageUrl(name);
  return {
    id,
    name,
    description: (data.description as string) ?? '',
    price: (data.price as number) ?? 0,
    category: (data.category as string) ?? 'Serviços',
    rating: (data.rating as number) ?? 5,
    reviewCount: (data.reviewCount as number) ?? 0,
    store: {
      name: (data.storeName as string) ?? 'Minha Loja',
      avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(
        ((data.storeName as string) ?? 'loja').slice(0, 12)
      )}/40/40`,
    },
    images: [{ id, description: name, imageUrl, imageHint: 'produto' }],
    sellerId: (data.sellerId as string) ?? '',
    stock: (data.stock as number) ?? 0,
    type: (data.type as ProductType) ?? 'Novo',
    source: 'firestore',
  };
}

export async function addProduct(
  sellerId: string,
  input: NewProductInput
): Promise<string> {
  const ref = await addDoc(productsCollection, {
    sellerId,
    name: input.name,
    description: input.description,
    price: input.price,
    category: input.category,
    type: input.type,
    stock: input.stock,
    storeName: input.storeName,
    imageUrl: buildImageUrl(input.name, input.imageUrl),
    rating: 5,
    reviewCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(
  productId: string,
  updates: Partial<NewProductInput>
): Promise<void> {
  await updateDoc(doc(db, 'products', productId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

export async function getProductsBySeller(
  sellerId: string
): Promise<SellerProduct[]> {
  const q = query(productsCollection, where('sellerId', '==', sellerId));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => mapDoc(d.id, d.data()));
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllProducts(): Promise<SellerProduct[]> {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data()));
  } catch {
    const snap = await getDocs(productsCollection);
    return snap.docs.map((d) => mapDoc(d.id, d.data()));
  }
}

export async function getProductById(
  productId: string
): Promise<SellerProduct | null> {
  const snap = await getDoc(doc(db, 'products', productId));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}
