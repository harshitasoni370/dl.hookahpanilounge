const externalBaseUrl = import.meta.env.VITE_WEBSITE_URL || "https://thedesirelounge.com";
const environment = import.meta.env.VITE_APP_ENV || (import.meta.env.MODE === "production" ? "production" : "uat");
const apiDefaults = {
  uat: "https://fumesandflavoursapi.cylsysuat.com/api/QR/qrcontext",
  production: "https://api.thedesirelounge.com/api/QR/qrcontext",
};
const gamesApiDefaults = {
  uat: "https://fumesandflavoursapi.cylsysuat.com/api",
  production: "https://api.thedesirelounge.com/api",
};

export const URLS = {
  api: {
    qrContext: import.meta.env.VITE_QR_CONTEXT_API_URL || apiDefaults[environment],
    gamesBase: import.meta.env.VITE_GAMES_API_URL || gamesApiDefaults[environment],
    reservationCategories: import.meta.env.VITE_RESERVATION_CATEGORIES_API_URL || `${gamesApiDefaults[environment]}/Reservation/getReservationCategories`,
    createReservation: import.meta.env.VITE_CREATE_RESERVATION_API_URL || `${gamesApiDefaults[environment]}/Reservation/CraeteReservation`,
  },
  app: {
    menu: import.meta.env.VITE_MENU_URL || "/menu",
    menuApp: import.meta.env.VITE_MENU_APP_URL || "https://app.thedesirelounge.com",
    categories: import.meta.env.VITE_CATEGORIES_URL || "https://app.thedesirelounge.com/categories",
  },
  website: {
    home: externalBaseUrl,
    reserve: `${externalBaseUrl}/#reserve`,
    liveSports: `${externalBaseUrl}/`,
    events: `${externalBaseUrl}/sunday-brunch`,
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
    imageBase: import.meta.env.VITE_IMAGE_BASE_URL || "https://fumesandflavoursapi.cylsysuat.com",
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
