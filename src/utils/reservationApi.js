import { apiRequest } from "./apiClient";
import { API } from "../config/urls";

function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "items", "categories", "result", "records"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

export async function fetchReservationCategories({ companyId, branchId, signal } = {}) {
  const params = { companyId, branchId };
  const payload = await apiRequest(API.upstream.reservationCategories, {
    params,
    signal,
  });
  return unwrap(payload).map((category) => ({
    value: String(
      category.value || category.categoryCode || category.code || category.categoryId || category.id || category.name || category.categoryName,
    ),
    label: String(category.label || category.name || category.categoryName || category.value),
  }));
}

export async function createReservation(payload, tableSessionId, { signal } = {}) {
  const headers = tableSessionId ? { "Table-Session-Id": tableSessionId } : {};
  return apiRequest(API.upstream.createReservation, {
    method: "POST",
    body: payload,
    headers,
    signal,
  });
}
