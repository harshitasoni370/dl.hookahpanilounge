const COMMON_FONTS = [
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Calibri",
  "Cambria",
  "Cambria Math",
  "Comic Sans MS",
  "Consolas",
  "Courier",
  "Courier New",
  "Georgia",
  "Helvetica",
  "Impact",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Microsoft Sans Serif",
  "Palatino Linotype",
  "Segoe UI",
  "Tahoma",
  "Times",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Noto Sans",
  "Noto Serif",
  "Poppins",
  "Inter",
  "Source Sans Pro",
  "Raleway",
  "Ubuntu",
  "Merriweather",
  "Playfair Display",
  "Work Sans",
  "Bitter",
  "Oswald",
  "Lora",
  "PT Sans",
  "PT Serif",
  "Arimo",
  "Cairo",
  "Nunito",
  "Quicksand",
  "Rubik",
  "Droid Sans",
  "Droid Serif",
  "HarmonyOS Sans",
  "MIUI Sans",
  "Oppo Sans",
  "Vivo Sans",
  "SF Pro Display",
  "SF Pro Text",
  "SF UI Text",
  "PingFang SC",
  "PingFang HK",
  "PingFang TC",
  "Hiragino Sans GB",
  "Hiragino Kaku Gothic ProN",
  "Heiti SC",
  "Microsoft YaHei",
  "Microsoft JhengHei",
  "SimSun",
  "SimHei",
];

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function fontsSupported() {
  if (!isBrowser()) return "";
  try {
    const baseFonts = ["monospace", "sans-serif", "serif"];
    const testString = "mmmmmmmmmmlli";
    const testSize = "72px";
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return "";

    const getFontWidth = (font) => {
      context.font = `${testSize} ${font}`;
      return context.measureText(testString).width;
    };

    const baseWidths = baseFonts.map((f) => ({
      font: f,
      width: getFontWidth(`${testSize} ${f}`),
    }));

    const detected = [];
    for (const font of COMMON_FONTS) {
      let detectedFont = false;
      for (const { font: base, width: baseWidth } of baseWidths) {
        const combinedWidth = getFontWidth(`${testSize} ${font}, ${base}`);
        if (Math.abs(combinedWidth - baseWidth) > 0.5) {
          detectedFont = true;
          break;
        }
      }
      if (detectedFont) detected.push(font);
    }
    return detected.sort().join("|");
  } catch {
    return "";
  }
}

function canvasFingerprint() {
  if (!isBrowser()) return "";
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("DeviceFP-Cylsys-DesireLounge-🍉🔥 你好🙂", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("DeviceFP-Cylsys-DesireLounge-🍉🔥 你好🙂", 4, 35);
    ctx.strokeStyle = "rgba(102, 204, 0, 0.4)";
    ctx.beginPath();
    ctx.arc(120, 45, 20, 0, Math.PI * 2);
    ctx.stroke();
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

function webglFingerprint() {
  if (!isBrowser()) return "";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return "";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const version = gl.getParameter(gl.VERSION);
    const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS)?.join("x");
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
    const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    const maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    return [
      vendor,
      renderer,
      version,
      shadingLanguageVersion,
      maxTextureSize,
      maxViewportDims,
      maxVertexAttribs,
      maxVaryingVectors,
      maxVertexUniformVectors,
      maxFragmentUniformVectors,
    ].join("||");
  } catch {
    return "";
  }
}

function audioFingerprint() {
  if (!isBrowser()) return "";
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return "";
    const audioCtx = new AC({ sampleRate: 44100 });
    try {
      const oscillator = audioCtx.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
      const analyser = audioCtx.createAnalyser();
      const gain = audioCtx.createGain();
      const compressor = audioCtx.createDynamicsCompressor();
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(compressor);
      compressor.connect(audioCtx.destination);
      const buffer = audioCtx.createBuffer(1, 4096, audioCtx.sampleRate);
      const channelData = buffer.getChannelData(0);
      analyser.getFloatTimeDomainData(channelData);
      let sum = 0;
      let sumSquares = 0;
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < channelData.length; i++) {
        const v = channelData[i];
        sum += v;
        sumSquares += v * v;
        if (v < min) min = v;
        if (v > max) max = v;
      }
      const mean = sum / channelData.length;
      const variance = sumSquares / channelData.length - mean * mean;
      oscillator.disconnect();
      analyser.disconnect();
      gain.disconnect();
      compressor.disconnect();
      return [
        audioCtx.sampleRate,
        audioCtx.baseLatency ?? "",
        audioCtx.outputLatency ?? "",
        mean.toFixed(10),
        variance.toFixed(10),
        min.toFixed(10),
        max.toFixed(10),
      ].join("|");
    } finally {
      audioCtx.close().catch(() => {});
    }
  } catch {
    return "";
  }
}

async function sha256(message) {
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h1 = 0xdeadbeef ^ 0x6a09e667;
  let h2 = 0x41c6ce57 ^ 0xbb67ae85;
  for (let i = 0; i < message.length; i++) {
    const ch = message.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, "0") +
    (h2 >>> 0).toString(16).padStart(8, "0") +
    (h1 >>> 0).toString(16).padStart(8, "0");
}

function collectFingerprintSignals() {
  if (!isBrowser()) {
    return { components: {}, raw: "server" };
  }
  const nav = navigator;
  const scr = window.screen || {};
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection || {};
  const batteryPromise = nav.getBattery ? nav.getBattery().catch(() => null) : Promise.resolve(null);

  const timezone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch {
      return "";
    }
  })();

  const locale = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().locale || nav.language || "";
    } catch {
      return nav.language || "";
    }
  })();

  const components = {
    userAgent: nav.userAgent || "",
    language: locale,
    languages: (nav.languages || []).join(","),
    platform: nav.platform || "",
    vendor: nav.vendor || "",
    vendorSub: nav.vendorSub || "",
    productSub: nav.productSub || "",
    cookieEnabled: nav.cookieEnabled ? "1" : "0",
    doNotTrack: nav.doNotTrack || "",
    hardwareConcurrency: nav.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory || 0,
    maxTouchPoints: nav.maxTouchPoints || 0,
    touchSupport: ("ontouchstart" in window) ? "1" : "0",
    webdriver: nav.webdriver ? "1" : "0",
    pdfViewerEnabled: nav.pdfViewerEnabled ? "1" : "0",
    appName: nav.appName || "",
    appVersion: nav.appVersion || "",
    mimeTypesLength: nav.mimeTypes ? nav.mimeTypes.length : 0,
    pluginsLength: nav.plugins ? nav.plugins.length : 0,
    screenWidth: scr.width || 0,
    screenHeight: scr.height || 0,
    availWidth: scr.availWidth || 0,
    availHeight: scr.availHeight || 0,
    colorDepth: scr.colorDepth || 0,
    pixelDepth: scr.pixelDepth || 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    innerWidth: window.innerWidth || 0,
    innerHeight: window.innerHeight || 0,
    outerWidth: window.outerWidth || 0,
    outerHeight: window.outerHeight || 0,
    scrollX: window.scrollX || 0,
    scrollY: window.scrollY || 0,
    orientation: (typeof screen !== "undefined" && (screen.orientation || {}).type) || "",
    timezone,
    timezoneOffset: new Date().getTimezoneOffset(),
    dateLocale: new Date(2020, 0, 1).toLocaleString(),
    connectionType: connection.effectiveType || connection.type || "",
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData ? "1" : "0",
    matchMediaDark: window.matchMedia ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : "",
    matchMediaReducedMotion: window.matchMedia ? (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "1" : "0") : "",
    matchMediaContrast: window.matchMedia ? (window.matchMedia("(prefers-contrast: more)").matches ? "1" : "0") : "",
    indexedDb: typeof indexedDB !== "undefined" ? "1" : "0",
    localStorage: typeof localStorage !== "undefined" ? "1" : "0",
    sessionStorage: typeof sessionStorage !== "undefined" ? "1" : "0",
    webgl: webglFingerprint(),
    canvas: canvasFingerprint(),
    fonts: fontsSupported(),
    audio: "",
    battery: "",
  };

  const componentsRaw = { components, batteryPromise };
  return componentsRaw;
}

export async function computeDeviceFingerprint() {
  if (!isBrowser()) {
    return { hash: "server-" + Math.random().toString(36).slice(2, 10), signals: {} };
  }
  const { components, batteryPromise } = collectFingerprintSignals();
  try {
    components.audio = audioFingerprint();
  } catch {
    components.audio = "";
  }
  if (batteryPromise && typeof batteryPromise.then === "function") {
    try {
      const battery = await batteryPromise;
      if (battery) {
        components.battery = [
          battery.level,
          battery.charging,
          battery.chargingTime,
          battery.dischargingTime,
        ].join("|");
      }
    } catch {
      components.battery = "";
    }
  }
  const keyOrder = [
    "userAgent", "language", "languages", "platform", "vendor", "vendorSub", "productSub",
    "cookieEnabled", "doNotTrack", "hardwareConcurrency", "deviceMemory", "maxTouchPoints",
    "touchSupport", "webdriver", "pdfViewerEnabled", "appName", "appVersion",
    "mimeTypesLength", "pluginsLength", "screenWidth", "screenHeight", "availWidth",
    "availHeight", "colorDepth", "pixelDepth", "devicePixelRatio", "innerWidth",
    "innerHeight", "outerWidth", "outerHeight", "orientation", "timezone",
    "timezoneOffset", "dateLocale", "connectionType", "downlink", "rtt", "saveData",
    "matchMediaDark", "matchMediaReducedMotion", "matchMediaContrast",
    "indexedDb", "localStorage", "sessionStorage",
    "webgl", "canvas", "fonts", "audio", "battery",
  ];
  const raw = keyOrder.map((k) => `${k}:${String(components[k] ?? "")}`).join("\n");
  const hash = await sha256(raw);
  return { hash, signals: components, raw };
}
