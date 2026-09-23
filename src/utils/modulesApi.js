import { apiRequest } from "./apiClient";
import { API } from "../config/urls";

export const DEFAULT_MODULES_CONTEXT = {
  companyId: "0ffbe39e-abf8-4827-9107-1a04b39f3416",
  branchId: "f4fb1d76-83a0-4965-86b5-63da28249dae",
};

function unwrapHeaders(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["headers", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapHeaders(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeHeaderModules(payload) {
  return unwrapHeaders(payload).map((header) => {
    const modules = Array.isArray(header.modules)
      ? header.modules.map((mod) => ({
          uidModuleId: asText(mod.uidModuleId || mod.moduleId || mod.id),
          moduleName: asText(mod.moduleName || mod.name),
          moduleType: asText(mod.moduleType || mod.type),
          subtitle: asText(mod.subtitle || mod.description),
          status: asText(mod.status, "ACTIVE"),
        }))
      : [];
    return {
      uidHeaderId: asText(header.uidHeaderId || header.headerId || header.id),
      headerName: asText(header.headerName || header.name),
      headerCode: asText(header.headerCode || header.code),
      modules,
    };
  });
}

export async function fetchHeaderModules(context = {}, { signal } = {}) {
  const companyId = context.companyId || DEFAULT_MODULES_CONTEXT.companyId;
  const branchId = context.branchId || DEFAULT_MODULES_CONTEXT.branchId;

  const payload = await apiRequest(API.upstream.headerModules, {
    params: { companyId, branchId },
    signal,
  });

  return normalizeHeaderModules(payload);
}
