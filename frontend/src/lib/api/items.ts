import type { Item } from "@/contracts/item";
import { ItemZ } from "@/contracts/item";
import { toItem } from "@/adapters/item";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080/api/v2";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return res.json();
}

export async function listItems(sectionId: string): Promise<Item[]> {
  const res = await fetch(`${BASE}/sections/${sectionId}/items`);
  const data = await j<unknown[]>(res);
  return data.map((d) => ItemZ.parse(toItem(d)));
}

export async function getItem(id: string): Promise<Item> {
  const res = await fetch(`${BASE}/items/${id}`);
  const data = await j<unknown>(res);
  return ItemZ.parse(toItem(data));
}

export async function createItem(sectionId: string, payload: Partial<Item>): Promise<Item> {
  const res = await fetch(`${BASE}/sections/${sectionId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await j<unknown>(res);
  return ItemZ.parse(toItem(data));
}

export async function updateItem(id: string, payload: Partial<Item>): Promise<Item> {
  const res = await fetch(`${BASE}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await j<unknown>(res);
  return ItemZ.parse(toItem(data));
}

export async function deleteItem(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${BASE}/items/${id}`, { method: "DELETE" });
  return j<{ ok: boolean }>(res);
}