import { apiRequest } from "./apiClient";
import { API, DEFAULT_COUNTRY_CODE } from "../config/urls";

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

function normalizeCreateReservationBody(body, deviceId) {
  const out = {
    companyId: body.companyId,
    branchId: body.branchId,
    moduleId: body.moduleId,
    guestName: body.guestName,
    countryCode: body.countryCode || DEFAULT_COUNTRY_CODE,
    mobile: body.mobile,
    email: body.email || "",
    dateOfBirth: body.dateOfBirth || null,
    guestCount: Number(body.guestCount || 1),
    reservationDateTime: body.reservationDateTime,
    reservationTitle: body.reservationTitle || null,
    tableId: body.tableId || "",
    specialRequest: body.specialRequest || "",
    extraDetails: body.extraDetails ?? null,
    deviceId: body.deviceId || deviceId || "",
  };
  return out;
}

export async function createReservation(payload, tableSessionId, { signal, deviceId } = {}) {
  const headers = tableSessionId ? { "Table-Session-Id": tableSessionId } : {};
  const body = normalizeCreateReservationBody(payload, deviceId);
  return apiRequest(API.upstream.createReservation, {
    method: "POST",
    body,
    headers,
    signal,
  });
}
