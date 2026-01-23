// constants/api.ts

export const BASE_URL = "http://192.168.100.10:4000";

// Tipos del backend
export type Category = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
};

export type Item = {
  id: string;
  type: "YOUTUBE" | "DRIVE" | "ONEDRIVE" | "OTHER";
  title: string;
  url: string;
  description?: string | null;
  createdAt: string;
};

// helper fetch JSON
async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data as T;
}

// ✅ Endpoints públicos
export function getCategories() {
  return fetchJSON<Category[]>("/api/categories");
}

export function getItemsByCategory(categoryId: string) {
  return fetchJSON<Item[]>(`/api/categories/${categoryId}/items`);
}

export function searchItems(q: string) {
  const qs = encodeURIComponent(q);
  return fetchJSON<any[]>(`/api/search?q=${qs}`);
}
