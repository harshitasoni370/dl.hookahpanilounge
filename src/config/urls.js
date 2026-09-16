const externalBaseUrl = import.meta.env.VITE_WEBSITE_URL || "https://thedesirelounge.com";
const environment = import.meta.env.VITE_APP_ENV || (import.meta.env.MODE === "production" ? "production" : "uat");
export const URLS = {
  api: {
    qrContext: import.meta.env.VITE_QR_CONTEXT_API_URL || "/api/qr-context",
    gamesBase: import.meta.env.VITE_GAMES_API_URL || "/api/games",
    reservationCategories: import.meta.env.VITE_RESERVATION_CATEGORIES_API_URL || "/api/reservation-categories",
    createReservation: import.meta.env.VITE_CREATE_RESERVATION_API_URL || "/api/create-reservation",
    customMoments: import.meta.env.VITE_CUSTOM_MOMENTS_API_URL || "/api/custom-moments",
    celebrationPackages: import.meta.env.VITE_CELEBRATION_PACKAGES_API_URL || "/api/celebration-packages",
    membership: import.meta.env.VITE_MEMBERSHIP_API_URL || "/api/membership",
  },
  app: {
    menu: import.meta.env.VITE_MENU_URL || "/menu",
    menuApp: import.meta.env.VITE_MENU_APP_URL || "https://app.thedesirelounge.com",
    categories: import.meta.env.VITE_CATEGORIES_URL || "https://app.thedesirelounge.com/categories",
  },
  website: {
    home: externalBaseUrl,
    reserve: `${externalBaseUrl}/#reserve`,
    liveSports: import.meta.env.VITE_LIVE_SPORTS_URL || `${externalBaseUrl}/live-sports`,
    events: import.meta.env.VITE_EVENTS_URL || `${externalBaseUrl}/events`,
  },
  contact: {
    phone: "+971509002202",
    whatsapp: "https://wa.me/971509002202",
    whatsappBooking: (message) => `https://wa.me/971509002202?text=${encodeURIComponent(message)}`,
  },
  social: {
    instagram: "https://www.instagram.com/desire_lounge_dubai",
    facebook: "https://www.facebook.com/desiresheeshalounge",
    tiktok: "https://www.tiktok.com/@desiresheshalounge",
    googleReviews: "https://g.page/r/CTqZiSxwUeXCEBM/review",
    maps: "https://maps.app.goo.gl/ZEzx6gWvyT3cqzB7",
  },
  delivery: {
    talabat: "https://www.talabat.com/uae/fumes-and-flavours",
    noon: "https://food.noon.com/en-ae/outlet/FMSNDF5UDU",
    keeta: "https://url-eu.mykeeta.com/utfRzGMz",
    smiles: "https://smiles.ae/",
    deliveroo: "https://deliveroo.ae/",
    careem: "https://www.careem.com/",
  },
  assets: {
    menu: "/assets/data/menu.json",
    boardGames: "/assets/data/board-games.json",
    imageBase: import.meta.env.VITE_IMAGE_BASE_URL || "https://restaurents-api.cylsys.com",
  },
  environment,
};

export const QR_CONTEXT_PARAMS = [
  "type",
  "location",
  "name",
  "resturant",
  "restaurant",
  "companyId",
  "branchId",
  "tableId",
  "sessionId",
];
export const QR_CONTEXT_STORAGE_KEY = "desire_qr_context";
