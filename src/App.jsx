import { useEffect, useRef } from "react";
import { pages } from "./pages";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQrContext, selectQrContext, selectQrContextStatus } from "./store/slices/qrContextSlice";
import { DEFAULT_CONTEXT, fetchGames } from "./utils/gamesApi";
import { createReservation, fetchReservationCategories } from "./utils/reservationApi";
import { DEFAULT_CUSTOM_MOMENT_CONTEXT, fetchCustomMoments } from "./utils/customMomentsApi";
import { fetchCelebrationPackages } from "./utils/celebrationPackagesApi";
import { fetchMembership } from "./utils/membershipApi";
import ExclusiveOffersPage from "./pages/ExclusiveOffersPage";
import { URLS } from "./config/urls";

const MENU_APP_URL = import.meta.env.VITE_MENU_APP_URL || "https://app.thedesirelounge.com";
const RESERVATION_URL = import.meta.env.VITE_RESERVATION_URL || "https://thedesirelounge.com/";
const LIVE_SPORTS_URL = import.meta.env.VITE_LIVE_SPORTS_URL || "https://thedesirelounge.com/live-sports";
const EVENTS_URL = import.meta.env.VITE_EVENTS_URL || "https://thedesirelounge.com/events";
const LOGO_URL = "https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp";
const DEFAULT_RESERVATION_MODULE_ID = "3e340f23-d842-47f0-98e8-b0d458dc22dd";
const DEFAULT_CELEBRATION_MODULE_IDS = {
  birthday: "02861404-4450-4d04-8461-679f3e8e09e3",
  corporate: "02ea8929-ad23-47a0-b416-db1d0f33ec46",
};
const DEFAULT_MEMBERSHIP_MODULE_ID = "b38fa611-ea6c-4414-9398-fbe6ca1d314c";

function normalizePath(path) {
  if (!path || path === "/index.html" || path === "/index") return "/";
  if (path === "/events.html" || path === "/events") return "/sunday-brunch";
  if (path === "/live-sports.html" || path === "/live-sports") return "/";
  if (path === "/gallery.html" || path === "/gallery" || path === "/about.html" || path === "/about") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

function buildMenuUrl(search, qrContext, pathname = "/") {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
  });
  const aliases = {
    tableNumber: data.tableNumber || data.tableNo || data.tableName || params.get("tableNumber") || params.get("tableNo") || params.get("tableName"),
    tableNo: data.tableNo || data.tableNumber || params.get("tableNo") || params.get("tableNumber"),
    tableSessionId: data.tableSessionId || data.sessionId || params.get("tableSessionId") || params.get("sessionId"),
    guestName: data.guestName || data.name || params.get("guestName"),
    mobile: data.mobile || data.phone || params.get("mobile") || params.get("phone"),
    email: data.email || params.get("email"),
    dateOfBirth: data.dateOfBirth || data.dob || params.get("dateOfBirth") || params.get("dob"),
    guestCount: data.guestCount || data.guests || params.get("guestCount") || params.get("guests"),
  };
  Object.entries(aliases).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return `${MENU_APP_URL}${pathname}${query ? `?${query}` : ""}`;
}

function getQueryValue(search, qrContext, key, fallback = "") {
  return qrContext?.data?.[key] || new URLSearchParams(search).get(key) || fallback;
}

function getExtraDetails(search) {
  const value = new URLSearchParams(search).get("extraDetails");
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function buildReservationPayload(search, qrContext, overrides = {}) {
  const context = getRequestContext(search, qrContext);
  return {
    companyId: context.companyId,
    branchId: context.branchId,
    moduleId: getQueryValue(search, qrContext, "moduleId", context.moduleId),
    guestName: getQueryValue(search, qrContext, "guestName", overrides.guestName),
    mobile: getQueryValue(search, qrContext, "mobile", overrides.mobile),
    email: getQueryValue(search, qrContext, "email", overrides.email),
    dateOfBirth: getQueryValue(search, qrContext, "dateOfBirth", overrides.dateOfBirth || null),
    guestCount: Number(getQueryValue(search, qrContext, "guestCount", overrides.guestCount || 1)),
    reservationDateTime: getQueryValue(search, qrContext, "reservationDateTime", overrides.reservationDateTime),
    reservationTitle: getQueryValue(search, qrContext, "reservationTitle", overrides.reservationTitle || null),
    tableId: getQueryValue(search, qrContext, "tableId", context.tableId),
    specialRequest: getQueryValue(search, qrContext, "specialRequest", overrides.specialRequest),
    extraDetails: overrides.extraDetails ?? getExtraDetails(search),
  };
}

function buildGameMenuUrl(search, qrContext, type, game) {
  const pathname = "/checkout";
  const url = new URL(buildMenuUrl(search, qrContext, pathname));
  const categoryName = type === "playstation" ? "PlayStation" : "Board Games";
  const reservation = buildReservationPayload(search, qrContext, {
    reservationTitle: "Gaming",
    extraDetails: { id: game.id, name: game.name },
  });
  url.searchParams.set("categoryName", categoryName);
  url.searchParams.set("category", categoryName);
  url.searchParams.set("gameName", game.name);
  url.searchParams.set("gameId", game.id);
  url.searchParams.set("sessionType", "Gaming Session");
  url.searchParams.set("players", game.players);
  url.searchParams.set("duration", game.duration);
  url.searchParams.set("difficulty", game.difficulty);
  url.searchParams.set("moduleId", reservation.moduleId);
  url.searchParams.set("tableId", reservation.tableId);
  url.searchParams.set("reservationTitle", reservation.reservationTitle);
  url.searchParams.set("extraDetails", JSON.stringify(reservation.extraDetails));
  url.searchParams.set("step", "about-you");
  url.searchParams.set("hideSteps", "true");
  url.searchParams.set("hideCardIcon", "true");
  return url.toString();
}

function buildMomentMenuUrl(search, qrContext, moment, context) {
  const url = new URL(buildMenuUrl(search, qrContext, "/checkout"));
  url.searchParams.set("companyId", context.companyId);
  url.searchParams.set("branchId", context.branchId);
  url.searchParams.set("sessionId", context.tableSessionId);
  if (isGuid(context.tableId)) {
    url.searchParams.set("tableId", context.tableId);
  }
  url.searchParams.set("categoryName", "Custom Moments");
  url.searchParams.set("category", "EVENT");
  url.searchParams.set("reservationCategory", "EVENT");
  url.searchParams.set("eventName", moment.name);
  url.searchParams.set("bookingType", "Custom Moment");
  url.searchParams.set("momentName", moment.name);
  url.searchParams.set("momentId", moment.id);
  if (moment.price) url.searchParams.set("price", moment.price);
  url.searchParams.set("sessionType", "Custom Moment");
  url.searchParams.set("extraDetails", JSON.stringify({
    id: moment.id,
    name: moment.name,
    price: moment.price || null,
  }));
  url.searchParams.set("moduleId", context.moduleId || "");
  url.searchParams.set("reservationTitle", "Custom Moment");
  url.searchParams.set("step", "about-you");
  url.searchParams.set("hideSteps", "true");
  url.searchParams.set("hideCardIcon", "true");
  return url.toString();
}

function buildPackageMenuUrl(search, qrContext, packageDetails) {
  const url = new URL(buildMenuUrl(search, qrContext, "/checkout"));
  const context = getRequestContext(search, qrContext);
  const price = String(packageDetails.price || "").match(/[\d.]+/)?.[0] || "";
  const extraDetails = {
    id: packageDetails.id || null,
    name: packageDetails.name,
    type: packageDetails.type,
    price: price || packageDetails.price || null,
  };

  url.searchParams.set("categoryName", packageDetails.categoryName);
  url.searchParams.set("category", packageDetails.category);
  url.searchParams.set("reservationCategory", packageDetails.category);
  url.searchParams.set("eventName", packageDetails.name);
  url.searchParams.set("bookingType", packageDetails.bookingType);
  url.searchParams.set("reservationTitle", packageDetails.name);
  url.searchParams.set("moduleId", packageDetails.moduleId || context.moduleId);
  if (context.tableId) url.searchParams.set("tableId", context.tableId);
  url.searchParams.set("price", price);
  url.searchParams.set("extraDetails", JSON.stringify(extraDetails));
  url.searchParams.set("step", "about-you");
  url.searchParams.set("hideSteps", "true");
  url.searchParams.set("hideCardIcon", "true");
  return url.toString();
}

function getPackageCheckoutDetails(href) {
  if (href.includes("book%20a%20Birthday%20Celebration")) {
    return {
      name: "Birthday Celebration Package",
      type: "birthday-package",
      categoryName: "Birthday Celebrations",
      category: "BIRTHDAY",
      bookingType: "Birthday Celebration",
    };
  }
  if (href.includes("enquire%20about%20Corporate%20Bookings")) {
    return {
      name: "Corporate Celebration Package",
      type: "corporate-package",
      categoryName: "Corporate Bookings",
      category: "CORPORATE",
      bookingType: "Corporate Booking",
    };
  }
  return null;
}

function getMembershipContext(search, qrContext) {
  const context = getRequestContext(search, qrContext);
  const data = qrContext?.data || {};
  const params = new URLSearchParams(search);
  return {
    companyId: data.companyId || params.get("companyId") || context.companyId,
    branchId: data.branchId || params.get("branchId") || context.branchId,
    moduleId: data.membershipModuleId || params.get("membershipModuleId") || DEFAULT_MEMBERSHIP_MODULE_ID,
  };
}

function getCelebrationContext(search, qrContext, type) {
  const context = getRequestContext(search, qrContext);
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: data.companyId || params.get("companyId") || context.companyId,
    branchId: data.branchId || params.get("branchId") || context.branchId,
    moduleId:
      data[`${type}ModuleId`] ||
      params.get(`${type}ModuleId`) ||
      DEFAULT_CELEBRATION_MODULE_IDS[type],
  };
}

function hasMatchingParams(search, contextParams) {
  const currentParams = new URLSearchParams(search);
  return Object.entries(contextParams || {}).every(([key, value]) => currentParams.get(key) === value);
}

function getGameContext(search, qrContext) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  const companyId = data.companyId || params.get("companyId") || params.get("companyID");
  const branchId = data.branchId || params.get("branchId") || params.get("branchID");
  return companyId && branchId ? { companyId, branchId } : null;
}

function getRequestContext(search, qrContext) {
  const context = getGameContext(search, qrContext) || DEFAULT_CONTEXT;
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    ...context,
    tableId: data.tableId || params.get("tableId") || "",
    moduleId: data.moduleId || params.get("moduleId") || DEFAULT_RESERVATION_MODULE_ID,
    tableSessionId:
      data.tableSessionId || data.sessionId || params.get("tableSessionId") || params.get("sessionId") || "",
  };
}

function getCustomMomentContext(search, qrContext) {
  const params = new URLSearchParams(search);
  const data = qrContext?.data || {};
  return {
    companyId: data.companyId || params.get("companyId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.companyId,
    branchId: data.branchId || params.get("branchId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.branchId,
    typeId: data.typeId || params.get("typeId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.typeId,
    search: params.get("momentSearch") || "The",
    tableSessionId:
      data.tableSessionId ||
      data.sessionId ||
      params.get("tableSessionId") ||
      params.get("sessionId") ||
      DEFAULT_CUSTOM_MOMENT_CONTEXT.tableSessionId,
    tableId:
      data.tableId ||
      params.get("tableId") ||
      data.tableNumber ||
      data.tableNo ||
      params.get("tableNumber") ||
      params.get("tableNo") ||
      "",
    moduleId: data.moduleId || params.get("moduleId") || DEFAULT_CUSTOM_MOMENT_CONTEXT.moduleId,
  };
}

function isGuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

function getReservationCategory(path) {
  if (path === "/birthday-celebrations") return "BIRTHDAY";
  if (path === "/corporate-bookings") return "CORPORATE";
  if (path === "/sunday-brunch") return "EVENT";
  if (path === "/make-it-your-moment") return "CUSTOM_MOMENT";
  if (path === "/playstation" || path === "/board-games") return "GAMING";
  if (path === "/exclusive-offers") return "EXCLUSIVE_OFFER";
  return "TABLE_RESERVATION";
}

function getReservationTitle(category) {
  const titles = {
    TABLE_RESERVATION: "Table Reservation",
    EVENT: "Event",
    LIVE_SPORTS: "Live Sports",
    GAMING: "Gaming",
    BOARD_GAME: "Board Game",
    EXCLUSIVE_OFFER: "Exclusive Offer",
    BIRTHDAY: "Birthday",
    CORPORATE: "Corporate",
    CUSTOM_MOMENT: "Custom Moment",
  };
  return titles[category] || "Table Reservation";
}

function isReservationTrigger(element) {
  if (element.matches("[data-game-session-link]")) return false;
  if (element.closest("#reserve-form")) return false;
  const text = element.textContent?.trim() || "";
  const href = element.getAttribute("href") || "";
  if (href.includes("#reserve")) return true;
  if (element.tagName === "BUTTON") {
    return /\b(reserve|reservation|book|booking)\b|request\s+(session|game)/i.test(text);
  }
  if (href.startsWith("/") && !href.includes("#")) return false;
  return /\b(reserve|reservation|book|booking)\b/i.test(text);
}

function openReservation(search, path, setOpen) {
  const params = new URLSearchParams(search);
  params.set("reservationCategory", getReservationCategory(path));
  window.location.assign(`${RESERVATION_URL}?${params.toString()}#reserve`);
  setOpen(false);
}

function initReservation(root, context) {
  const form = root.querySelector("#reserve-form");
  if (!form) return () => {};

  const categoryField = document.createElement("input");
  categoryField.type = "hidden";
  categoryField.name = "reservationCategory";
  categoryField.value = new URLSearchParams(window.location.search).get("reservationCategory") || "TABLE_RESERVATION";
  form.appendChild(categoryField);
  const note = form.querySelector("#reserve-note");
  const preferredCategory = new URLSearchParams(window.location.search).get("reservationCategory");
  const modalTitle = root.querySelector("#reserve-modal-title");
  const updateTitle = (category) => {
    if (modalTitle) modalTitle.textContent = getReservationTitle(category);
  };
  updateTitle(preferredCategory || "TABLE_RESERVATION");

  fetchReservationCategories(context)
    .then((categories) => {
      if (preferredCategory && categories.some(({ value }) => value === preferredCategory)) {
        categoryField.value = preferredCategory;
      }
    })
    .catch((error) => {
      console.error(error);
      categoryField.remove();
    });

  const onSubmit = async (event) => {
    if (!form.checkValidity()) return;
    event.preventDefault();
    const data = new FormData(form);
    const reservationDateTime = `${data.get("date")}T${data.get("time")}:00`;
    const searchParams = new URLSearchParams(window.location.search);
    const queryExtraDetails = getExtraDetails(window.location.search);
    const gameId = searchParams.get("gameId");
    const gameName = searchParams.get("gameName");
    const extraDetails = queryExtraDetails || (gameId || gameName ? { id: gameId, name: gameName } : null);
    try {
      await createReservation({
        companyId: context.companyId,
        branchId: context.branchId,
        guestName: data.get("name"),
        mobile: data.get("phone"),
        dateOfBirth: data.get("dateOfBirth") || null,
        guestCount: Number(data.get("guests") || 1),
        reservationDateTime,
        email: data.get("email") || "",
        reservationTitle: data.get("reservationCategory") || "TABLE_RESERVATION",
        tableId: searchParams.get("tableId") || context.tableId || "",
        moduleId: searchParams.get("moduleId") || context.moduleId || "",
        specialRequest: data.get("notes") || "",
        reservationCategory: data.get("reservationCategory"),
        extraDetails,
      }, context.tableSessionId);
      if (note) note.textContent = "Reservation request received. We’ll confirm shortly.";
      form.reset();
    } catch (error) {
      console.error(error);
      if (note) note.textContent = "Unable to submit reservation. Please try again.";
    }
  };
  form.addEventListener("submit", onSubmit);
  return () => {
    form.removeEventListener("submit", onSubmit);
    categoryField.remove();
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGameCards(games, type, search, qrContext) {
  const imageFolder = type === "playstation" ? "ps" : "games";
  return games.map((game) => {
    const image = game.image || `/assets/images/${imageFolder}/${game.cover}.webp`;
    const available = game.status === "available";
    return `<article class="bg-card" data-categories="${escapeHtml(game.categories.join(" "))}" data-name="${escapeHtml(game.name.toLowerCase())}" data-id="${escapeHtml(game.id)}">
      <div class="bg-card__media bg-card__media--${escapeHtml(game.cover)}">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(game.name)}" width="640" height="400" loading="lazy" decoding="async" />
      </div>
      <div class="bg-card__body">
        <h3 class="bg-card__title">${escapeHtml(game.name)}</h3>
        <ul class="bg-card__meta">
          <li>Players: ${escapeHtml(game.players)}</li>
          <li>Duration: ${escapeHtml(game.duration)}</li>
          <li>Difficulty: ${escapeHtml(game.difficulty)}</li>
        </ul>
        <div class="bg-card__availability-row">
          <div class="bg-card__status bg-card__status--${available ? "available" : "busy"}">
            <span class="bg-card__status-dot" aria-hidden="true"></span>
            <span>${available ? "Available" : "In Use"}</span>
          </div>
          ${available ? `<div class="bg-card__actions bg-card__actions--single"><a class="bg-card__btn bg-card__btn--solid bg-card__btn--status" data-game-session-link href="${escapeHtml(buildGameMenuUrl(search, qrContext, type, game))}">Reserve Session</a></div>` : ""}
        </div>
      </div>
    </article>`;
  }).join("");
}

function initGamesApi(root, type, context, search, qrContext) {
  const prefix = type === "playstation" ? "ps" : "bg";
  const grid = root.querySelector(`#${prefix}-grid`);
  const empty = root.querySelector(`#${prefix}-empty`);
  const count = root.querySelector(`#${prefix}-count`);
  const filters = root.querySelector(`#${prefix}-filters`);
  const searchInput = root.querySelector(`#${prefix}-search`);
  if (!grid || !filters) return () => {};

  let cancelled = false;
  let games = [];
  let activeCategory = "all";
  let query = "";

  const render = () => {
    const normalizedQuery = query.trim().toLowerCase();
    const visible = games.filter((game) => {
      const categoryMatches = activeCategory === "all" || game.categories.includes(activeCategory);
      const searchMatches = !normalizedQuery || `${game.name} ${game.difficulty} ${game.categories.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return categoryMatches && searchMatches;
    });
    grid.innerHTML = renderGameCards(visible, type, search, qrContext);
    grid.hidden = visible.length === 0;
    if (empty) empty.hidden = visible.length > 0;
    if (count) count.textContent = `${visible.length} game${visible.length === 1 ? "" : "s"}`;
  };

  const onFilter = (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeCategory = button.dataset.filter || "all";
    filters.querySelectorAll("[data-filter]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  };
  const onSearch = () => {
    query = searchInput.value;
    render();
  };

  filters.addEventListener("click", onFilter);
  searchInput?.addEventListener("input", onSearch);
  grid.innerHTML = '<p class="bg-loading">Loading games...</p>';

  fetchGames(type, {
    companyId: context?.companyId,
    branchId: context?.branchId,
  })
    .then((loadedGames) => {
      if (cancelled) return;
      games = loadedGames;
      render();
    })
    .catch((error) => {
      if (cancelled) return;
      console.error(error);
      grid.innerHTML = "";
      grid.hidden = true;
      if (empty) {
        empty.hidden = false;
        const message = empty.querySelector("p");
        if (message) message.textContent = "Unable to load games right now.";
      }
    });

  return () => {
    cancelled = true;
    filters.removeEventListener("click", onFilter);
    searchInput?.removeEventListener("input", onSearch);
  };
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qrContext = useSelector(selectQrContext);
  const qrContextStatus = useSelector(selectQrContextStatus);
  const rootRef = useRef(null);
  const path = normalizePath(location.pathname);
  const html = (pages[path] ?? pages["/"]).replace(
    'src="assets/images/careem.avif"',
    'src="/assets/images/careem.avif"',
  ).replaceAll("assets/images/logo.webp?v=20260821", LOGO_URL)
    .replaceAll('href="https://thedesirelounge.com/events.html"', `href="${EVENTS_URL}"`)
    .replaceAll('href="https://thedesirelounge.com/live-sports.html"', `href="${LIVE_SPORTS_URL}"`);
  useEffect(() => {
    dispatch(fetchQrContext(location.search));
  }, [location.search]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll('.hero-anim').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    const toggle = root.querySelector("#nav-toggle");
    const drawer = root.querySelector("#lounge-drawer");
    const backdrop = root.querySelector("#drawer-backdrop");
    const reservationModal = root.querySelector("#reserve-modal");

    const setOpen = (open) => {
      if (!toggle || !drawer) return;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.hidden = !open;
      if (backdrop) backdrop.hidden = !open;
      document.body.classList.toggle("lounge-drawer-open", open);
    };

    const onToggle = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
    const onBackdrop = () => setOpen(false);
    const setReservationOpen = (open) => {
      if (!reservationModal) return;
      reservationModal.hidden = !open;
      reservationModal.classList.toggle("is-inline", open);
      if (open) reservationModal.querySelector("input, select, textarea")?.focus();
    };
    const onReservationClose = () => {
      setReservationOpen(false);
      navigate(`${location.pathname}${location.search}`);
    };
    toggle?.addEventListener("click", onToggle);
    backdrop?.addEventListener("click", onBackdrop);
    reservationModal?.querySelectorAll("[data-reserve-close]").forEach((element) => {
      element.addEventListener("click", onReservationClose);
    });
    if (location.hash === "#reserve") setReservationOpen(true);

    const links = [...root.querySelectorAll("a")];
    const onLink = (e) => {
      const link = e.currentTarget;
      let href = link.getAttribute("href");
      if (link.matches("[data-package-book]") && link.dataset.packageDetails) {
        e.preventDefault();
        const packageDetails = JSON.parse(link.dataset.packageDetails);
        window.location.assign(buildPackageMenuUrl(location.search, qrContext, packageDetails));
        return;
      }
      const packageDetails = getPackageCheckoutDetails(href || "");
      if (packageDetails) {
        e.preventDefault();
        window.location.assign(buildPackageMenuUrl(location.search, qrContext, packageDetails));
        return;
      }
      if (isReservationTrigger(link)) {
        e.preventDefault();
        openReservation(location.search, path, setOpen);
        return;
      }
      if ((href === LIVE_SPORTS_URL || href === EVENTS_URL) && location.search) {
        e.preventDefault();
        const targetUrl = new URL(href, window.location.origin);
        const currentParams = new URLSearchParams(location.search);
        currentParams.forEach((value, key) => {
          if (!targetUrl.searchParams.has(key)) targetUrl.searchParams.set(key, value);
        });
        window.location.assign(targetUrl.toString());
        return;
      }
      if (href?.startsWith(MENU_APP_URL) && location.search) {
        e.preventDefault();
        const targetUrl = new URL(href);
        const targetPath = targetUrl.pathname;
        const targetSearch = targetUrl.search || location.search;

        if (qrContextStatus === "loading" || qrContextStatus === "idle") {
          const onContextReady = (event) => {
            window.location.replace(buildMenuUrl(targetSearch, event.detail, targetPath));
          };
          window.addEventListener("qr-context-ready", onContextReady, { once: true });
          window.setTimeout(() => {
            window.removeEventListener("qr-context-ready", onContextReady);
            if (document.visibilityState === "visible") {
              window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath));
            }
          }, 8000);
          return;
        }

        window.location.replace(buildMenuUrl(targetSearch, qrContext, targetPath));
        return;
      }
      const isInternalPath = typeof href === "string" && href.startsWith("/") && !href.startsWith("//");

      if (isInternalPath) {
        e.preventDefault();
        navigate(href);
        setOpen(false);
      }
    };
    links.forEach(a => a.addEventListener("click", onLink));
    const buttons = [...root.querySelectorAll("button")];
    const onButton = (e) => {
      if (path === "/make-it-your-moment") {
        const button = e.currentTarget;
        const card = button.closest(".bg-card");
        if (card && button.matches("[data-action='book']")) {
          e.preventDefault();
          const name = card.querySelector(".bg-card__title")?.textContent?.trim() || "Custom Moment";
          const id = card.dataset.id || "custom-moment";
          const priceText = card.querySelector(".bg-card__meta li span")?.textContent || "";
          const price = priceText.match(/[\d.]+/)?.[0] || "";
          window.location.assign(buildMomentMenuUrl(
            location.search,
            qrContext,
            { id, name, price },
            getCustomMomentContext(location.search, qrContext),
          ));
          return;
        }
      }
      if (isReservationTrigger(e.currentTarget)) {
        e.preventDefault();
        openReservation(location.search, path, setOpen);
      }
    };
    buttons.forEach((button) => button.addEventListener("click", onButton));

    // Lightweight reservation feedback for the original static form.
    const forms = [...root.querySelectorAll("form")];
    const onSubmit = (e) => {
      const form = e.currentTarget;
      if (!form.checkValidity()) return;
      if (form.id === "reserve-form" && path !== "/make-it-your-moment") {
        e.preventDefault();
        const note = form.querySelector("#reserve-note");
        if (note) note.textContent = "Reservation request received. We’ll confirm shortly.";
        form.reset();
      }
    };
    forms.forEach(f => f.addEventListener("submit", onSubmit));
    const cleanupReservation = initReservation(root, getRequestContext(location.search, qrContext));

    // Keep hash navigation working after React route changes.
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        setTimeout(() => root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({behavior:"smooth", block:"start"}), 50);
      });
    } else {
      window.scrollTo({top:0, behavior:"instant"});
    }

    return () => {
      toggle?.removeEventListener("click", onToggle);
      backdrop?.removeEventListener("click", onBackdrop);
      links.forEach(a => a.removeEventListener("click", onLink));
      buttons.forEach((button) => button.removeEventListener("click", onButton));
      reservationModal?.querySelectorAll("[data-reserve-close]").forEach((element) => {
        element.removeEventListener("click", onReservationClose);
      });
      forms.forEach(f => f.removeEventListener("submit", onSubmit));
      cleanupReservation();
      document.body.classList.remove("lounge-drawer-open");
    };
  }, [path, location.hash, location.search, qrContext, qrContextStatus]);

  useEffect(() => {
    if (path !== "/playstation" && path !== "/board-games") return undefined;
    const qrGameContext = getGameContext(location.search, qrContext);
    if (qrContextStatus === "loading" && location.search && !qrGameContext) return undefined;
    const gameContext = qrGameContext || DEFAULT_CONTEXT;
    return initGamesApi(rootRef.current, path === "/playstation" ? "playstation" : "board-games", {
      companyId: gameContext.companyId,
      branchId: gameContext.branchId,
    }, location.search, qrContext);
  }, [path, location.search, qrContext, qrContextStatus]);

  useEffect(() => {
    if (path !== "/make-it-your-moment") return undefined;

    const grid = rootRef.current?.querySelector("#moment-grid");
    if (!grid) return undefined;

    const controller = new AbortController();
    const cards = [...grid.querySelectorAll(".bg-card")];
    const loading = document.createElement("p");
    loading.className = "bg-loading";
    loading.textContent = "Loading moments...";
    loading.setAttribute("role", "status");
    cards.forEach((card) => {
      card.hidden = true;
    });
    grid.prepend(loading);
    grid.setAttribute("aria-busy", "true");

    fetchCustomMoments(getCustomMomentContext(location.search, qrContext), {
      signal: controller.signal,
    })
      .then((moments) => {
        loading.remove();
        grid.setAttribute("aria-busy", "false");
        cards.forEach((card) => {
          card.hidden = true;
        });
        moments.forEach((moment, index) => {
          const card = cards[index];
          if (!card) return;
          card.dataset.name = moment.name.toLowerCase();
          card.dataset.categories = moment.category;
          card.dataset.id = moment.id;
          const bookButton = card.querySelector("[data-action='book']");
          if (bookButton) bookButton.dataset.id = moment.id;
          const title = card.querySelector(".bg-card__title");
          const description = card.querySelector(".bg-card__desc");
          const price = card.querySelector(".bg-card__meta li span");
          const status = card.querySelector(".bg-card__status span:last-child");
          const image = card.querySelector(".bg-card__media img");
          if (title) title.textContent = moment.name;
          if (description && moment.description) description.textContent = moment.description;
          if (price && moment.price) price.textContent = `AED ${moment.price}`;
          if (status) status.textContent = moment.available ? "Available" : "Unavailable";
          if (image && moment.image) {
            image.src = moment.image.startsWith("http")
              ? moment.image
              : `${URLS.assets.imageBase}${moment.image.startsWith("/") ? "" : "/"}${moment.image}`;
          }
          card.hidden = !moment.available;
        });
        const count = grid.parentElement?.querySelector("#moment-count");
        const availableCount = moments.filter((moment) => moment.available).length;
        if (count) count.textContent = `${availableCount} moment${availableCount === 1 ? "" : "s"}`;
        if (!availableCount) {
          loading.textContent = "No moments are available right now.";
          loading.hidden = false;
          grid.append(loading);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error("Unable to load custom moments", error);
        loading.textContent = "Unable to load moments right now.";
        grid.setAttribute("aria-busy", "false");
      });

    return () => {
      controller.abort();
      loading.remove();
      grid.setAttribute("aria-busy", "false");
    };
  }, [path, location.search, qrContext]);

  useEffect(() => {
    const type = path === "/birthday-celebrations" ? "birthday" : path === "/corporate-bookings" ? "corporate" : null;
    if (!type) return undefined;

    const packageGrid = rootRef.current?.querySelector(".offer-packages");
    const bookingLink = rootRef.current?.querySelector(".offer-sheet__cta");
    if (!packageGrid || !bookingLink) return undefined;

    const cards = [...packageGrid.querySelectorAll(".offer-package")];
    const loading = document.createElement("p");
    loading.className = "bg-loading";
    loading.textContent = "Loading packages...";
    loading.setAttribute("role", "status");
    cards.forEach((card) => { card.hidden = true; });
    packageGrid.prepend(loading);
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-package";
    bookingLink.textContent = "Select a package first";
    bookingLink.setAttribute("aria-disabled", "true");

    const controller = new AbortController();
    const context = getCelebrationContext(location.search, qrContext, type);
    const onSelect = (event) => {
      const selectedCard = event.target.closest(".offer-package[data-package-details]");
      if (!selectedCard || !packageGrid.contains(selectedCard)) return;
      const packageDetails = selectedCard.dataset.packageDetails;
      cards.forEach((card) => card.classList.toggle("is-selected", card === selectedCard));
      bookingLink.dataset.packageDetails = packageDetails;
      bookingLink.textContent = `Book ${JSON.parse(packageDetails).name}`;
      bookingLink.removeAttribute("aria-disabled");
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect(event);
    };
    packageGrid.addEventListener("click", onSelect);
    packageGrid.addEventListener("keydown", onKeyDown);

    fetchCelebrationPackages(type, { ...context, signal: controller.signal })
      .then((packages) => {
        loading.remove();
        cards.forEach((card) => { card.hidden = true; });
        packages.forEach((item, index) => {
          const card = cards[index];
          if (!card) return;
          card.hidden = false;
          const title = card.querySelector("h2");
          const description = card.querySelector("p");
          if (title) title.textContent = `${item.name}${item.price ? ` — ${item.price}` : ""}`;
          if (description) description.textContent = item.description;
          const details = JSON.stringify({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            type: `${type}-package`,
            categoryName: type === "birthday" ? "Birthday Celebrations" : "Corporate Bookings",
            category: type === "birthday" ? "BIRTHDAY" : "CORPORATE",
            bookingType: type === "birthday" ? "Birthday Celebration" : "Corporate Booking",
          });
          card.dataset.packageDetails = details;
          card.setAttribute("role", "button");
          card.setAttribute("tabindex", "0");
          card.setAttribute("aria-label", `Select ${item.name}`);
        });
        if (!packages.length) {
          loading.textContent = "No packages are available right now.";
          packageGrid.append(loading);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error(`Unable to load ${type} packages`, error);
        loading.textContent = "Unable to load packages right now.";
        cards.forEach((card) => { card.hidden = true; });
      });

    return () => {
      controller.abort();
      packageGrid.removeEventListener("click", onSelect);
      packageGrid.removeEventListener("keydown", onKeyDown);
      loading.remove();
    };
  }, [path, location.search, qrContext]);

  useEffect(() => {
    if (path !== "/privilege-membership") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const bookingLink = panel?.querySelector(".offer-sheet__cta");
    if (!panel || !bookingLink) return undefined;

    const context = getMembershipContext(location.search, qrContext);
    const loading = document.createElement("p");
    loading.className = "bg-loading";
    loading.textContent = "Loading membership...";
    loading.setAttribute("role", "status");
    panel.append(loading);
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#join-membership";
    bookingLink.textContent = "Loading membership...";
    bookingLink.setAttribute("aria-disabled", "true");

    const controller = new AbortController();
    fetchMembership({ ...context, signal: controller.signal })
      .then((membership) => {
        loading.remove();
        const name = membership.name || membership.membershipName || "Desire Privilege Membership";
        const price = membership.priceLabel || membership.price || "";
        const description = membership.subtitle || "";
        const details = JSON.stringify({
          id: membership.id || membership.membershipId || context.moduleId,
          name,
          price,
          description,
          terms: membership.terms || "",
          features: membership.features || [],
          type: "membership",
          categoryName: "Desire Privilege Membership",
          category: "MEMBERSHIP",
          bookingType: "Membership",
          moduleId: context.moduleId,
        });
        const summary = document.createElement("p");
        summary.className = "offer-sheet__membership-summary";
        summary.textContent = `${name}${price ? ` — ${price}` : ""}${description ? ` · ${description}` : ""}`;
        panel.append(summary);
        bookingLink.dataset.packageDetails = details;
        bookingLink.textContent = `Join ${name}`;
        bookingLink.removeAttribute("aria-disabled");
        const terms = panel.querySelector(".offer-sheet__terms");
        if (terms && membership.terms) terms.textContent = membership.terms;
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error("Unable to load membership", error);
        loading.textContent = "Unable to load membership right now.";
        bookingLink.textContent = "Membership unavailable";
      });

    return () => {
      controller.abort();
      loading.remove();
      panel.querySelector(".offer-sheet__membership-summary")?.remove();
    };
  }, [path, location.search, qrContext]);

  useEffect(() => {
    if (path !== "/exclusive-offers") return undefined;

    const panel = rootRef.current?.querySelector(".offer-sheet__panel");
    const offerGrid = panel?.querySelector(".offer-packages");
    const bookingLink = panel?.querySelector(":scope > .offer-sheet__cta");
    if (!offerGrid || !bookingLink) return undefined;

    const cards = [...offerGrid.querySelectorAll(".offer-package")];
    const originalHref = bookingLink.href;
    bookingLink.dataset.packageBook = "true";
    bookingLink.href = "#book-offer";
    bookingLink.textContent = "Select an offer first";
    bookingLink.setAttribute("aria-disabled", "true");

    const selectCard = (card) => {
      const title = card.querySelector("h2")?.textContent?.trim() || "Exclusive Offer";
      const description = [...card.querySelectorAll("p, li")]
        .map((element) => element.textContent.trim())
        .filter(Boolean)
        .join(" ");
      const price = title.match(/AED\s*[\d.]+|\d+%|Complimentary/i)?.[0] || "";
      const details = {
        id: card.dataset.offerId || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: title,
        price,
        description,
        type: "exclusive-offer",
        categoryName: "Exclusive Offers",
        category: "EXCLUSIVE_OFFER",
        bookingType: "Exclusive Offer",
        moduleId: getRequestContext(location.search, qrContext).moduleId,
      };
      cards.forEach((item) => item.classList.toggle("is-selected", item === card));
      bookingLink.dataset.packageDetails = JSON.stringify(details);
      bookingLink.textContent = `Book ${title}`;
      bookingLink.removeAttribute("aria-disabled");
    };
    const onClick = (event) => {
      const card = event.target.closest(".offer-package");
      if (!card || !offerGrid.contains(card) || event.target.closest("a")) return;
      selectCard(card);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".offer-package");
      if (!card) return;
      event.preventDefault();
      selectCard(card);
    };
    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Select ${card.querySelector("h2")?.textContent?.trim() || "exclusive offer"}`);
    });
    offerGrid.addEventListener("click", onClick);
    offerGrid.addEventListener("keydown", onKeyDown);

    return () => {
      offerGrid.removeEventListener("click", onClick);
      offerGrid.removeEventListener("keydown", onKeyDown);
      bookingLink.href = originalHref;
      delete bookingLink.dataset.packageBook;
      delete bookingLink.dataset.packageDetails;
      bookingLink.textContent = "Ask About Offers";
      bookingLink.removeAttribute("aria-disabled");
      cards.forEach((card) => {
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-label");
        card.classList.remove("is-selected");
      });
    };
  }, [path, location.search, qrContext]);

  if (path === "/exclusive-offers") return <ExclusiveOffersPage />;

  if (path === "/menu") {
    const hasFreshContext = qrContext?.data && hasMatchingParams(location.search, qrContext.params);
    const canRedirect = !location.search || hasFreshContext || qrContextStatus === "failed";
    if (canRedirect) window.location.replace(buildMenuUrl(location.search, qrContext));
    return null;
  }

  return <div ref={rootRef} className="lounge-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
