import { DEVICE_ID_STORAGE_KEY } from "../config/urls";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function generateRandomDeviceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const rand = (n) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  return `${rand(8)}-${rand(4)}-4${rand(3)}-${(
    8 + Math.floor(Math.random() * 4)
  ).toString(16)}${rand(3)}-${rand(12)}`;
}

function readCookie(name) {
  if (!isBrowser()) return null;
  try {
    const parts = document.cookie.split(";").map((part) => part.trim());
    const prefix = `${name}=`;
    const hit = parts.find((part) => part.startsWith(prefix));
    return hit ? decodeURIComponent(hit.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

function writeCookie(name, value) {
  if (!isBrowser()) return;
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

function readStorage(storage, key) {
  if (!isBrowser()) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage, key, value) {
  if (!isBrowser()) return;
  try {
    storage.setItem(key, value);
  } catch {
    /* private mode / quota */
  }
}

export function readUrlDeviceId(search) {
  const raw =
    search ||
    (isBrowser() ? window.location.search : "");
  const params = new URLSearchParams(raw.startsWith("?") || raw.includes("=") ? raw : `?${raw}`);
  return params.get("deviceId") || params.get("did") || null;
}

export function persistDeviceId(id) {
  if (!id) return;
  writeStorage(window.localStorage, DEVICE_ID_STORAGE_KEY, id);
  writeStorage(window.sessionStorage, DEVICE_ID_STORAGE_KEY, id);
  writeCookie(DEVICE_ID_STORAGE_KEY, id);
}

export function readStoredDeviceId() {
  return (
    readStorage(window.localStorage, DEVICE_ID_STORAGE_KEY) ||
    readStorage(window.sessionStorage, DEVICE_ID_STORAGE_KEY) ||
    readCookie(DEVICE_ID_STORAGE_KEY)
  );
}

/**
 * Same phone + same browser should keep the same deviceId across QR scans.
 * URL `did` / `deviceId` wins so the website and menu app stay in sync.
 */
export function getOrCreateDeviceIdSync(search) {
  const fromUrl = readUrlDeviceId(search);
  if (fromUrl) {
    persistDeviceId(fromUrl);
    return fromUrl;
  }

  const storedId = readStoredDeviceId();
  if (storedId) {
    persistDeviceId(storedId);
    return storedId;
  }

  const newDeviceId = generateRandomDeviceId();
  persistDeviceId(newDeviceId);
  return newDeviceId;
}

export async function getOrCreateDeviceId(search) {
  return getOrCreateDeviceIdSync(search);
}
