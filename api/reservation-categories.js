import https from "node:https";

const upstreamBase = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "https://restaurents-api.cylsys.com/api";

export default async function handler(req, res) {
  const { companyId, branchId } = req.query || {};
  if (!companyId || !branchId) {
    res.status(400).json({ error: "companyId and branchId are required" });
    return;
  }

  const params = new URLSearchParams({ companyId, branchId });
  https.get(`${upstreamBase}/Reservation/getReservationCategories?${params}`, (response) => {
    let text = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => { text += chunk; });
    response.on("end", () => {
      res.status(response.statusCode || 502).setHeader("Content-Type", "application/json").send(text);
    });
  }).on("error", (error) => {
    res.status(502).json({ error: "Unable to reach reservation categories API", detail: error.message });
  });
}
