import { URLS } from "../config/urls";

function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "items", "categories", "result", "records"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export async function fetchReservationCategories({ companyId, branchId }) {
  const params = new URLSearchParams({ companyId, branchId });
  const response = await fetch(`${URLS.api.reservationCategories}?${params}`);
  if (!response.ok) throw new Error(`Failed to load reservation categories (${response.status})`);
  return unwrap(await response.json()).map((category) => ({
    value: String(category.value || category.categoryCode || category.code || category.categoryId || category.id || category.name || category.categoryName),
    label: String(category.label || category.name || category.categoryName || category.value),
  }));
}

export async function createReservation(payload) {
  const response = await fetch(URLS.api.createReservation, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Reservation failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}
