import https from "node:https";

const upstreamBase = `${process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "https://restaurents-api.cylsys.com/api"}/Membership/GetMembershipPageData`;
const defaultModuleId = "b38fa611-ea6c-4414-9398-fbe6ca1d314c";

export default async function handler(req, res) {
  const { companyId, branchId, moduleId = defaultModuleId } = req.query || {};
  if (!companyId || !branchId) {
    res.status(400).json({ error: "companyId and branchId are required" });
    return;
  }

  const params = new URLSearchParams({ companyId, branchId, moduleId });
  https.get(`${upstreamBase}?${params}`, (response) => {
    let text = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => { text += chunk; });
    response.on("end", () => {
      res.status(response.statusCode || 502).setHeader("Content-Type", "application/json").send(text);
    });
  }).on("error", (error) => {
    res.status(502).json({ error: "Unable to reach membership API", detail: error.message });
  });
}
