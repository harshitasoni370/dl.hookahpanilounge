import { getImageUrl } from "./imageUrl";

const DEFAULT_CONTEXT = {
  companyId: "0ffbe39e-abf8-4827-9107-1a04b39f3416",
  branchId: "f4fb1d76-83a0-4965-86b5-63da28249dae",
};

function unwrapGames(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["games", "items", "data", "result", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = unwrapGames(value);
      if (nested.length) return nested;
    }
  }
  return [];
}

function asText(value, fallback = "") {
  if (Array.isArray(value)) return value.join(", ");
  return value === null || value === undefined ? fallback : String(value);
}

export function normalizeGames(payload) {
  return unwrapGames(payload).map((game, index) => {
    const name = asText(game.name || game.gameName || game.title, `Game ${index + 1}`);
    const categories = game.categories || game.category || game.genre || game.categoryName || [];
    const imagePath = game.image || game.imageUrl || game.imagePath || game.coverImage || "";
    return {
      ...game,
      id: asText(game.id || game.gameId || game.code, `game-${index + 1}`),
      name,
      players: asText(game.players || game.playerCount || game.noOfPlayers || (game.playersMin && `${game.playersMin} - ${game.playersMax}`), "Ask staff"),
      duration: asText(game.duration || game.playTime || game.time || (game.durationMin && `${game.durationMin} - ${game.durationMax} min`), "Available on request"),
      difficulty: asText(game.difficulty || game.level, "All levels"),
      status: game.isAvailable === false ? "in-use" : asText(game.status || game.availability, "available").toLowerCase(),
      categories: (Array.isArray(categories) ? categories : [categories])
        .filter(Boolean)
        .map((category) => asText(category).toLowerCase().replace(/\s+/g, "-")),
      cover: asText(game.cover || game.imageName || game.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), "default"),
      image: getImageUrl(imagePath),
      howToPlay: asText(game.howToPlay || game.description, "Ask a team member how to play."),
    };
  });
}

export async function fetchGames(type, context = {}) {
  const companyId = context.companyId || DEFAULT_CONTEXT.companyId;
  const branchId = context.branchId || DEFAULT_CONTEXT.branchId;
  const proxyUrl = `/api/games?type=${encodeURIComponent(type)}&companyId=${encodeURIComponent(companyId)}&branchId=${encodeURIComponent(branchId)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error(`Failed to load ${type} games (${response.status})`);
  return normalizeGames(await response.json());
}

export { DEFAULT_CONTEXT };
