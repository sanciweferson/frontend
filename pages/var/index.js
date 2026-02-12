async function carregarPagina() {
  try {
    const API_URL =
      location.hostname === "localhost"
        ? "http://localhost:3000/api/pages/var"
        : "https://bakend-f8o0.onrender.com/api/pages/var";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    const dados = await response.json();
    renderizarCards(dados);
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    document.querySelector(".content").innerHTML =
      `<p style="color:red">Erro ao carregar: ${erro.message}</p>`;
  }
}

// ====== COLORIR CÓDIGO ======
function colorirCodigo(texto) {
  if (!texto) return "";

  let html = texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const regex = /\b(var|let|const)\b|\b(name)\b|(=)|(\".*?\"|\'.*?\')/g;

  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="token-keyword">${p1}</span>`;
    if (p2) return `<span class="token-variable">${p2}</span>`;
    if (p3) return `<span class="token-operator">${p3}</span>`;
    if (p4) return `<span class="token-string">${p4}</span>`;
    return match;
  });
}

// ====== RENDER ======
function renderizarCards(dados) {
  const container = document.querySelector(".content");
  container.innerHTML = "";

  const titulo = document.createElement("h1");
  titulo.textContent = dados.title;
  container.appendChild(titulo);

  dados.cards.forEach(card => {
    const section = document.createElement("section");
    section.classList.add("card");

    if (card.type === "explanation") {
      section.innerHTML = `
        <h2>${card.title}</h2>
        <p>${card.description}</p>
      `;
    }

    if (card.type === "example") {
      const codigoPuro = card.code.join("\n");

      const codigoFormatado = card.code
        .map(linha => `<div>${colorirCodigo(linha)}</div>`)
        .join("");

      section.innerHTML = `
        <h2>${card.description}</h2>

        <div class="code-wrapper">
          <button 
            class="btn-copy" 
            data-code="${codigoPuro.replace(/"/g, "&quot;")}"
          >
            Copiar código
          </button>

          <div class="code-block">${codigoFormatado}</div>
        </div>

        <div class="result">
          Resultado: <strong>${card.value}</strong>
        </div>
      `;
    }

    container.appendChild(section);
  });
}

// ====== COPIAR ======
document.addEventListener("click", async (e) => {
  const botao = e.target.closest(".btn-copy");
  if (!botao) return;

  const codigo = botao.dataset.code;

  try {
    await navigator.clipboard.writeText(codigo);
    botao.textContent = "Copiado! ✅";
    setTimeout(() => botao.textContent = "Copiar código", 1500);
  } catch (err) {
    alert("Falha ao copiar o código");
    console.error(err);
  }
});

// ====== START ======
carregarPagina();
