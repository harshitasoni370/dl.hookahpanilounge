import https from "node:https";

const upstreamBase = "https://fumesandflavoursapi.cylsysuat.com/api";

function forwardGetWithBody(url, body) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (response) => {
      let text = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { text += chunk; });
      response.on("end", () => resolve({ status: response.statusCode || 502, text }));
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

export default async function handler(req, res) {
  const type = req.query?.type;
  const endpoint = type === "playstation"
    ? "Playstation/Playstationgamelist"
    : type === "board-games"
      ? "BoardGame/Boardgamelist"
      : null;
  const { companyId, branchId } = req.query || {};

  if (!endpoint || !companyId || !branchId) {
    res.status(400).json({ error: "type, companyId and branchId are required" });
    return;
  }

  try {
    const result = await forwardGetWithBody(
      `${upstreamBase}/${endpoint}`,
      JSON.stringify({ companyId, branchId }),
    );
    res.status(result.status).setHeader("Content-Type", "application/json").send(result.text);
  } catch (error) {
    res.status(502).json({ error: "Unable to reach games API", detail: error.message });
  }
}
