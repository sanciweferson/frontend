import {
  setupMenuToggle,
  setupMenuStateOnLoad,
  setupLinkClicks,
  closeSideMenu
} from "./menuActions.js";

const MOBILE_BREAKPOINT = 768;

const handleResize = () => {
  const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;

  if (isDesktop) {
    closeSideMenu(); // fecha o menu mobile ao virar desktop
  }
};

export const initMenu = () => {
  const checkInterval = setInterval(() => {
    const toggleBtn = document.getElementById("js-menu-toggle");
    const sideMenu = document.getElementById("js-nav-aside");

    if (toggleBtn && sideMenu) {
      setupMenuToggle();
      setupMenuStateOnLoad();
      setupLinkClicks();

      // fecha menu se passar de 768px
      handleResize();
      window.addEventListener("resize", handleResize);

      clearInterval(checkInterval);
    }
  }, 50);

  setTimeout(() => clearInterval(checkInterval), 5000);
};