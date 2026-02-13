// menuActions.js

const getMenuElements = () => {
  return {
    btn: document.getElementById("js-menu-toggle"),
    side: document.getElementById("js-nav-aside")
  };
};

const handleKeyboardFocus = (e) => {
  const { btn, side } = getMenuElements();
  if (!side || !side.classList.contains("open")) return;

  if (e.key === "Escape") {
    closeSideMenu();
    return;
  }

  if (e.key === "Tab") {
    const focusables = Array.from(
      side.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')
    );

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      btn.focus();
      e.preventDefault();
    }

    if (!e.shiftKey && document.activeElement === btn) {
      first.focus();
      e.preventDefault();
    }

    if (!e.shiftKey && document.activeElement === last) {
      btn.focus();
      e.preventDefault();
    }
  }
};

export const openSideMenu = (isInitialLoad = false) => {
  const { btn, side } = getMenuElements();
  if (!btn || !side) return;

  side.classList.add("open");
  side.removeAttribute("aria-hidden");
  side.removeAttribute("inert");

  btn.setAttribute("aria-expanded", "true");
  btn.setAttribute("aria-label", "Fechar menu");

  // troca ícones (hamburger -> close)
  btn.querySelector(".nav__icon--open")?.classList.add("hidden");
  btn.querySelector(".nav__icon--close")?.classList.remove("hidden");

  document.addEventListener("keydown", handleKeyboardFocus);

  if (!isInitialLoad) {
    const firstLink = side.querySelector('a[href], button');
    (firstLink || btn).focus();
  }

  localStorage.setItem("menuOpen", "true");
};

export const closeSideMenu = () => {
  const { btn, side } = getMenuElements();
  if (!btn || !side) return;

  if (side.contains(document.activeElement)) {
    btn.focus();
  }

  side.classList.remove("open");
  side.setAttribute("aria-hidden", "true");
  side.setAttribute("inert", "");

  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", "Abrir menu");

  // troca ícones (close -> hamburger)
  btn.querySelector(".nav__icon--open")?.classList.remove("hidden");
  btn.querySelector(".nav__icon--close")?.classList.add("hidden");

  document.removeEventListener("keydown", handleKeyboardFocus);
  localStorage.setItem("menuOpen", "false");
};

export const setupMenuToggle = () => {
  const { btn, side } = getMenuElements();

  btn?.addEventListener("click", () => {
    side.classList.contains("open") ? closeSideMenu() : openSideMenu();
  });
};

export const setupMenuStateOnLoad = () => {
  const isMenuOpen = localStorage.getItem("menuOpen") === "true";

  if (isMenuOpen) {
    openSideMenu(true);
  } else {
    closeSideMenu();
  }
};

export const setupLinkClicks = () => {
  const { side } = getMenuElements();

  side?.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", () => closeSideMenu());
  });
};