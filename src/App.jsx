import { useEffect, useRef } from "react";
import { pages } from "./pages";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQrContext, selectQrContext, selectQrContextStatus } from "./store/slices/qrContextSlice";
import { DEFAULT_CONTEXT, fetchGames } from "./utils/gamesApi";
import { createReservation, fetchReservationCategories } from "./utils/reservationApi";
import { DEFAULT_CUSTOM_MOMENT_CONTEXT, fetchCustomMoments } from "./utils/customMomentsApi";
import { URLS } from "./config/urls";

const MENU_APP_URL = import.meta.env.VITE_MENU_APP_URL || "https://app.thedesirelounge.com";
const RESERVATION_URL = import.meta.env.VITE_RESERVATION_URL || "https://thedesirelounge.com/";
const LOGO_URL = "https://restaurents-api.cylsys.com/Assets/theDesireLounge/Image/Logo/logo.webp";

function normalizePath(path) {
  if (!path || path === "/index.html" || path === "/index") return "/";
  if (path === "/events.html" || path === "/events") return "/sunday-brunch";
  if (path === "/live-sports.html" || path === "/live-sports") return "/";
  if (path === "/gallery.html" || path === "/gallery" || path === "/about.html" || path === "/about") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

function buildMenuUrl(search, qrContext, pathname = "/") {
  const params = new URLSearchParams(search);
  Object.entries(qrContext?.data || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return `${MENU_APP_URL}${pathname}${query ? `?${query}` : ""}`;
}

function buildGameMenuUrl(search, qrContext, type, game) {
  const pathname = "/checkout";
  const url = new URL(buildMenuUrl(search, qrContext, pathname));
  const categoryName = type === "playstation" ? "PlayStation" : "Board Games";
  url.searchParams.set("categoryName", categoryName);
  url.searchParams.set("category", categoryName);
  url.searchParams.set("gameName", game.name);
  url.searchParams.set("gameId", game.id);
  url.searchParams.set("sessionType", "Gaming Session");
  url.searchParams.set("players", game.players);
  url.searchParams.set("duration", game.duration);
  url.searchParams.set("difficulty", game.difficulty);
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
  url.searchParams.set("step", "about-you");
  url.searchParams.set("hideSteps", "true");
  url.searchParams.set("hideCardIcon", "true");
  return url.toString();
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
  return getGameContext(search, qrContext) || DEFAULT_CONTEXT;
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
    moduleId: data.moduleId || params.get("moduleId") || "",
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
    try {
      await createReservation({
        companyId: context.companyId,
        branchId: context.branchId,
        guestName: data.get("name"),
        mobile: data.get("phone"),
        dateOfBirth: null,
        guestCount: Number(data.get("guests")),
        reservationDateTime,
        email: data.get("email") || "",
        reservationTitle: null,
        ...(isGuid(context.tableId) ? { tableId: context.tableId } : {}),
        moduleId: context.moduleId || "",
        specialRequest: data.get("notes") || "",
        reservationCategory: data.get("reservationCategory"),
        extraDetails: context.momentId
          ? { id: context.momentId, name: context.momentName }
          : null,
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
    .replaceAll('href="https://thedesirelounge.com/events.html"', 'href="/sunday-brunch"')
    .replaceAll('href="https://thedesirelounge.com/live-sports.html"', 'href="/"');
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
      if (isReservationTrigger(link)) {
        e.preventDefault();
        openReservation(location.search, path, setOpen);
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
    fetchCustomMoments(getCustomMomentContext(location.search, qrContext), {
      signal: controller.signal,
    })
      .then((moments) => {
        const cards = [...grid.querySelectorAll(".bg-card")];
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
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Unable to load custom moments", error);
      });

    return () => controller.abort();
  }, [path, location.search, qrContext]);

  if (path === "/menu") {
    const hasFreshContext = qrContext?.data && hasMatchingParams(location.search, qrContext.params);
    const canRedirect = !location.search || hasFreshContext || qrContextStatus === "failed";
    if (canRedirect) window.location.replace(buildMenuUrl(location.search, qrContext));
    return null;
  }

  return <div ref={rootRef} className="lounge-page" dangerouslySetInnerHTML={{ __html: html }} />;
}
