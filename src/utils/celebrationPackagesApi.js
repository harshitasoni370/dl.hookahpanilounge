import { URLS } from "../config/urls";

function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.packages || payload?.data?.packages || [];
}

function text(value, fallback = "") {
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeCelebrationPackages(payload) {
  return unwrap(payload).map((item, index) => ({
    ...item,
    id: text(item.packageId || item.id, `package-${index + 1}`),
    name: text(item.packageName || item.name, `Package ${index + 1}`),
    price: text(item.priceLabel || item.price || item.amount),
    description: text(item.description),
  }));
}

export async function fetchCelebrationPackages(type, { companyId, branchId, moduleId, signal } = {}) {
  const params = new URLSearchParams({ type, companyId, branchId });
  if (moduleId) params.set("moduleId", moduleId);
  const response = await fetch(`${URLS.api.celebrationPackages}?${params}`, { signal });
  if (!response.ok) throw new Error(`Failed to load ${type} packages (${response.status})`);
  return normalizeCelebrationPackages(await response.json());
}