import { URLS } from "../config/urls";

export async function fetchMembership({ companyId, branchId, moduleId, signal } = {}) {
  const params = new URLSearchParams({ companyId, branchId });
  if (moduleId) params.set("moduleId", moduleId);
  const response = await fetch(`${URLS.api.membership}?${params}`, { signal });
  if (!response.ok) throw new Error(`Failed to load membership (${response.status})`);
  const payload = await response.json();
  return payload?.data || payload;
}