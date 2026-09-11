import { URLS } from "../config/urls";

export function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${URLS.assets.imageBase}/${String(imagePath).replace(/^\/+/, "")}`;
}