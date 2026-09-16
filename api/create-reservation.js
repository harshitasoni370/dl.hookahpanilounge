import https from "node:https";

const upstreamBase = process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "https://restaurents-api.cylsys.com/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = JSON.stringify(req.body || {});
  const upstream = https.request(`${upstreamBase}/Reservation/CraeteReservation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      ...(req.headers["table-session-id"] ? { "Table-Session-Id": req.headers["table-session-id"] } : {}),
    },
  }, (response) => {
    let text = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => { text += chunk; });
    response.on("end", () => {
      if (response.statusCode === 204) {
        res.status(204).end();
        return;
      }
      res.status(response.statusCode || 502).setHeader("Content-Type", "application/json").send(text);
    });
  });
  upstream.on("error", (error) => {
    res.status(502).json({ error: "Unable to reach reservation API", detail: error.message });
  });
  upstream.write(body);
  upstream.end();
}
