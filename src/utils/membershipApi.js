import { apiRequest } from "./apiClient";
import { API, MODULE_IDS } from "../config/urls";

export async function fetchMembership({ companyId, branchId, moduleId, signal } = {}) {
  const params = { companyId, branchId, moduleId: moduleId || MODULE_IDS.membership };
  const payload = await apiRequest(API.upstream.membership, {
    params,
    signal,
  });
  return payload?.data || payload;
}
