import https from "node:https";

const upstreamBase = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "https://restaurents-api.cylsys.com/api";
const moduleIds = {
  birthday: "02861404-4450-4d04-8461-679f3e8e09e3",
  corporate: "02ea8929-ad23-47a0-b416-db1d0f33ec46",
};

function forwardGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let text = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { text += chunk; });
      response.on("end", () => resolve({ status: response.statusCode || 502, text }));
    }).on("error", reject);
  });
}

export default async function handler(req, res) {
  const type = req.query?.type;
  const endpoint = type === "birthday" ? "Birthday/GetBirthdayPageData" : type === "corporate" ? "Corporate/GetCorporatePageData" : null;
  const { companyId, branchId } = req.query || {};

  if (!endpoint || !companyId || !branchId) {
    res.status(400).json({ error: "type, companyId and branchId are required" });
    return;
  }

  const moduleId = req.query.moduleId || moduleIds[type];
  const params = new URLSearchParams({ companyId, branchId, moduleId });
  try {
    const result = await forwardGet(`${upstreamBase}/${endpoint}?${params}`);
    res.status(result.status).setHeader("Content-Type", "application/json").send(result.text);
  } catch (error) {
    res.status(502).json({ error: "Unable to reach celebration packages API", detail: error.message });
  }
}
