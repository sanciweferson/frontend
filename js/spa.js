let app, homeHTML, paginaAtual = null;

function capturarHome() {
    app = document.getElementById("app");
    homeHTML = app.innerHTML;
    
    // Checa se já iniciamos em uma página específica
    const urlParams = new URLSearchParams(window.location.search);
    const rotaInicial = urlParams.get('pagina');
    if (rotaInicial) carregarPagina(rotaInicial);
}

function carregarPagina(pagina) {
    if (!pagina) return;
    
    const url = `/partials/pages/${pagina}/index.html`;
    
    fetch(url)
        .then(res => res.ok ? res.text() : Promise.reject("Página não encontrada"))
        .then(html => {
            app.innerHTML = html;
            window.scrollTo(0, 0);
            document.title = `JS Docs — ${pagina.split('/').pop()}`;
            
            carregarScriptDaPagina(pagina);
            carregarCSSDaPagina(pagina);
        })
        .catch(err => {
            app.innerHTML = `<h2>Erro 404: ${err}</h2>`;
        });
}

// Injeção dinâmica de assets (CSS/JS da aula)
function carregarScriptDaPagina(pagina) {
    document.getElementById("script-pagina")?.remove();
    const script = document.createElement("script");
    script.src = `/partials/pages/${pagina}/index.js`;
    script.id = "script-pagina";
    script.onerror = () => script.remove();
    document.body.appendChild(script);
}

function carregarCSSDaPagina(pagina) {
    document.getElementById("css-pagina")?.remove();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/partials/pages/${pagina}/index.css`;
    link.id = "css-pagina";
    link.onerror = () => link.remove();
    document.head.appendChild(link);
}

// Interceptor de cliques
document.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    e.preventDefault();

    if (href.includes("?pagina=")) {
        const urlParams = new URLSearchParams(href.split('?')[1]);
        const pagina = urlParams.get("pagina");
        if (pagina && pagina !== paginaAtual) {
            paginaAtual = pagina;
            history.pushState(null, "", `?pagina=${pagina}`);
            carregarPagina(pagina);
        }
    } else if (href === "/") {
        history.pushState(null, "", "/");
        app.innerHTML = homeHTML;
        paginaAtual = null;
    }
});

window.addEventListener("popstate", () => {
    const pagina = new URLSearchParams(location.search).get("pagina");
    pagina ? carregarPagina(pagina) : (app.innerHTML = homeHTML);
});

window.addEventListener("DOMContentLoaded", capturarHome);