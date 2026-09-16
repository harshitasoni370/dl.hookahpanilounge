import https from "node:https";

const upstreamUrl = "https://fumesandflavoursapi.cylsysuat.com/api/CustomMoment/GetCustomMoments";

function forwardGetWithBody(body, tableSessionId) {
  return new Promise((resolve, reject) => {
    const request = https.request(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Table-Session-Id": tableSessionId,
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
  const { companyId, branchId, search = "", typeId } = req.query || {};
  const tableSessionId = req.headers["table-session-id"];

  if (!companyId || !branchId || !typeId || !tableSessionId) {
    res.status(400).json({ error: "companyId, branchId, typeId and Table-Session-Id are required" });
    return;
  }

  try {
    const result = await forwardGetWithBody(
      JSON.stringify({ companyId, branchId, search, typeId }),
      tableSessionId,
    );
    res.status(result.status).setHeader("Content-Type", "application/json").send(result.text);
  } catch (error) {
    res.status(502).json({ error: "Unable to reach custom moments API", detail: error.message });
  }
}
