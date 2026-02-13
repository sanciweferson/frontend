// ====== 1. CARREGAR API ======
async function carregarPagina() {
  try {
    const API_URL = location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/pages/var"
      : "https://bakend-f8o0.onrender.com/api/pages/var";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

    const dados = await response.json();
    renderizarCards(dados);

  } catch (erro) {
    console.error("Erro ao carregar:", erro);
    document.querySelector(".content").innerHTML = `<p style="color:red">Erro: ${erro.message}</p>`;
  }
}

// ====== 2. COLORIR CÓDIGO (LEXER SIMPLES) ======
function colorirCodigo(texto) {
  if (!texto) return "";
  let html = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const regex = /\b(var|let|const|function|return|for|if|else|push)\b|\b(name|valor|i|funcoes|hoisting|lixo|dizerOi|shadowing|valorAtual|console|log)\b|(=|\+|\<|\>|\!|\[|\]|\{|\}|\(|\))|(\".*?\"|\'.*?\')/g;
  
  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="token-keyword">${p1}</span>`;
    if (p2) return `<span class="token-variable">${p2}</span>`;
    if (p3) return `<span class="token-operator">${p3}</span>`;
    if (p4) return `<span class="token-string">${p4}</span>`;
    return match;
  });
}

// ====== 3. RENDERIZAR TUDO DINAMICAMENTE ======
function renderizarCards(dados) {
  const container = document.querySelector(".content");
  if (!container) return;
  container.innerHTML = "";

  // 3.1 Cabeçalho Dinâmico
  const header = document.createElement("header");
  header.innerHTML = `
    <h1>${dados.title || "Sem título"}</h1>
    <p>${dados.description || ""}</p>
    <hr>
  `;
  container.appendChild(header);

  // 3.2 Loop de Cards
  dados.cards.forEach(card => {
    const section = document.createElement("section");
    section.className = "card";

    if (card.type === "explanation") {
      section.innerHTML = `<h2>${card.title}</h2><p>${card.description}</p>`;
    } 
    
    else if (card.type === "example") {
      const codigoPuro = Array.isArray(card.code) ? card.code.join("\n") : card.code;
      
      // --- MOTOR DE EXECUÇÃO DINÂMICO ---
      let output = [];
      let finalReturn = undefined;

      try {
        // Criamos um console fake para capturar logs
        const mockConsole = { 
            log: (...args) => output.push(args.map(a => 
                typeof a === 'object' ? JSON.stringify(a) : String(a)
            ).join(' ')) 
        };

        // Transformamos o código em uma função executável
        // Adicionamos um "return" implícito na última linha se possível
        const scriptFunc = new Function("console", `
            try {
                ${codigoPuro}
            } catch(e) { 
                throw e; 
            }
        `);

        finalReturn = scriptFunc(mockConsole);
      } catch (err) {
        output.push(`<span style="color:red">${err.name}: ${err.message}</span>`);
      }

      // Se não houve console.log mas houve um erro ou retorno, tratamos aqui
      const displayResult = output.length > 0 ? output.join("<br>") : String(finalReturn);

      // --- MONTAGEM DO HTML ---
      section.innerHTML = `
        <h2>${card.title}</h2>
        <button class="btn-copy" data-code="${codigoPuro.replace(/"/g, '&quot;')}">Copiar código</button>
        <div class="code-block">
          ${Array.isArray(card.code) 
            ? card.code.map(linha => `<div>${colorirCodigo(linha)}</div>`).join('') 
            : `<div>${colorirCodigo(card.code)}</div>`}
        </div>
        <div class="result">
          <strong>Resultado:</strong> 
          <code style="display:block; margin-top:5px;">${displayResult === "undefined" ? "<i>undefined</i>" : displayResult}</code>
        </div>
      `;
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

carregarPagina();