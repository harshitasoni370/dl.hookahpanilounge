import { apiRequest } from "./apiClient";
import { API, MODULE_IDS } from "../config/urls";

function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.packages || payload?.data?.packages || payload?.data || [];
}

function text(value, fallback = "") {
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeCelebrationPackages(payload) {
  const list = unwrap(payload);
  return (Array.isArray(list) ? list : []).map((item, index) => ({
    ...item,
    id: text(item.packageId || item.id, `package-${index + 1}`),
    name: text(item.packageName || item.name, `Package ${index + 1}`),
    price: text(item.priceLabel || item.price || item.amount),
    description: text(item.description),
  }));
}

export async function fetchCelebrationPackages(type, { companyId, branchId, moduleId, signal } = {}) {
  const params = { companyId, branchId, moduleId: moduleId || MODULE_IDS[type] };
  const directUrl = type === "birthday" ? API.upstream.birthdayPackages : API.upstream.corporatePackages;

  const payload = await apiRequest(directUrl, {
    params: { type, ...params },
    signal,
  });
  return normalizeCelebrationPackages(payload);
}
