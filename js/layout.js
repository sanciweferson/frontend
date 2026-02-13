// Apenas o essencial para o funcionamento estrutural
const Icons = {
    hamburger: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
};
function createToggleMenu() {
  return `
    <li class="nav__item">
      <button id="js-menu-toggle" type="button" class="nav__btn-toggle" aria-label="Abrir menu" aria-expanded="false">
        <span class="nav__icon--open">${Icons.hamburger}</span>
        <span class="nav__icon--close hidden">${Icons.close}</span>
      </button>
    </li>
  `;
}

function createNavItem(item) {
    const subPages = item.pages.map(page => {
        const route = page.href.replace('/partials/pages/', '').replace('/index.html', '');
        return `<li><a href="?pagina=${route}">${page.text}</a></li>`;
    }).join('');

    return `
        <li class="nav__dropdown">
            <div class="nav__label"><span>${item.title}</span></div>
            <ul class="nav__submenu">${subPages}</ul>
        </li>
    `;
}

class NavBar extends HTMLElement {
    async connectedCallback() {
        try {
            const res = await fetch('/partials/data/menu.json');
            const navMenu = await res.json();
            const linksHTML = navMenu.map(createNavItem).join("");
              const menuToggleHTML = createToggleMenu();

            this.innerHTML = `
                <nav class="nav">
                    <div class="nav__container">
                        <ul class="nav__list--logo">
                            <li><a href="/" class="logo-text">JS Docs</a></li>
                        </ul>
                        
                             <ul class=" nav__list--toggle-btn">${menuToggleHTML}</ul>
                        <ul class="nav__list--desktop">
                            ${linksHTML}
                        </ul>
                    </div>

                    <aside class="nav__aside" id="js-nav-aside">
                        <ul class="nav__list--mobile">
                            ${linksHTML}
                        </ul>
                    </aside>
                </nav>
            `;
        } catch (err) {
            console.error("Erro ao carregar menu:", err);
        }
    }
}

customElements.define("nav-bar", NavBar);