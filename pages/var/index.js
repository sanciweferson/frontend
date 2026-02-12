// ====== 1. FUNÇÃO PARA CARREGAR API ======
async function carregarPagina() {
  try {
    const API_URL = location.hostname === "localhost"
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
    const content = document.querySelector(".content");
    if (content) {
      content.innerHTML = `<p style="color:red">Erro ao carregar: ${erro.message}</p>`;
    }
  }
}

// ====== 2. FUNÇÃO PARA COLORIR CÓDIGO ======
function colorirCodigo(texto) {
  if (!texto) return "";
  let html = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const regex = /\b(var|let|const)\b|\b(name)\b|(=)|(\".*?\"|\'.*?\')/g;

  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="token-keyword">${p1}</span>`;
    if (p2) return `<span class="token-variable">${p2}</span>`;
    if (p3) return `<span class="token-operator">${p3}</span>`;
    if (p4) return `<span class="token-string">${p4}</span>`;
    return match;
  });
}

// ====== 3. FUNÇÃO PARA RENDERIZAR CARDS ======
function renderizarCards(dados) {
  const container = document.querySelector(".content");
  if (!container) return;
  container.innerHTML = "";

  const titulo = document.createElement("h1");
  titulo.textContent = dados.title;
  container.appendChild(titulo);

  dados.cards.forEach(card => {
    const section = document.createElement("section");
    section.classList.add("card");

    // Cards de Explicação
    if (card.type === "explanation") {
      section.innerHTML = `
        <h2>${card.title}</h2>
        <p>${card.description}</p>
      `;
    } 
    
    // Cards de Exemplo
    else if (card.type === "example") {
      const h2 = document.createElement("h2");
      h2.textContent = card.title;

      const btnCopy = document.createElement("button");
      btnCopy.classList.add("btn-copy");
      btnCopy.textContent = "Copiar código";
      const codigoPuro = Array.isArray(card.code) ? card.code.join("\n") : card.code;
      btnCopy.dataset.code = codigoPuro;

      const codeBlock = document.createElement("div");
      codeBlock.classList.add("code-block");
      
      const linhas = Array.isArray(card.code) ? card.code : [card.code];
      linhas.forEach(linha => {
        const div = document.createElement("div");
        div.innerHTML = colorirCodigo(linha);
        codeBlock.appendChild(div);
      });

      // --- LÓGICA DO RESULTADO (VALOR DA VARIÁVEL) ---
      const result = document.createElement("div");
      result.classList.add("result");

      // Tenta pegar o valor da API
      let displayValue = card.value;

      // Se a API não mandou 'value', a gambiarra entra em ação:
      if (!displayValue && card.code) {
        const codigoTexto = Array.isArray(card.code) ? card.code.join(" ") : card.code;
        // Procura a última ocorrência de texto entre aspas
        const matches = codigoTexto.match(/"([^"]+)"/g);
        if (matches) {
          // Pega o último texto encontrado e remove as aspas
          displayValue = matches[matches.length - 1].replace(/"/g, "");
        }
      }

      result.innerHTML = `Resultado: <strong>${displayValue || "Ver console"}</strong>`;

      section.appendChild(h2);
      section.appendChild(btnCopy);
      section.appendChild(codeBlock);
      section.appendChild(result);
    }

    container.appendChild(section);
  });
}

// ====== 4. EVENTO DE COPIAR ======
document.addEventListener("click", async (e) => {
  const botao = e.target.closest(".btn-copy");
  if (!botao) return;

  try {
    await navigator.clipboard.writeText(botao.dataset.code);
    const original = botao.textContent;
    botao.textContent = "Copiado! ✅";
    setTimeout(() => botao.textContent = original, 1500);
  } catch (err) {
    console.error("Erro ao copiar", err);
  }
});

// Inicia o processo
carregarPagina();