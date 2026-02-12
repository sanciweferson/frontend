// ====== FUNÇÃO PARA CARREGAR API ======
// Marcamos como 'async' para podermos usar o 'await' em operações que demoram (como o fetch)
async function carregarPagina() {
  try {
    // Verifica se o site está rodando no seu computador (localhost) ou na internet
    // Isso evita que você tenha que mudar o link manualmente toda vez que fizer deploy
    const API_URL = location.hostname === "localhost"
      ? "http://localhost:3000/api/pages/var" // URL para teste local
      : "https://bakend-f8o0.onrender.com/api/pages/var"; // URL do seu servidor online

    // Faz a requisição para a API e espera a resposta chegar
    const response = await fetch(API_URL);

    // Se a resposta não for bem-sucedida (ex: erro 404 ou 500), lança um erro
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    // Converte o corpo da resposta (que vem em texto puro) para um objeto JavaScript (JSON)
    const dados = await response.json();
    
    // Chama a função que vai desenhar os elementos na tela usando os dados recebidos
    renderizarCards(dados);

  } catch (erro) {
    // Caso ocorra qualquer erro no processo acima, ele cai aqui
    console.error("Erro ao carregar dados:", erro);
    
    // Seleciona o container de conteúdo e exibe uma mensagem de erro vermelha para o usuário
    document.querySelector(".content").innerHTML = 
      `<p style="color:red">Erro ao carregar: ${erro.message}</p>`;
  }
}

// ====== FUNÇÃO PARA COLORIR CÓDIGO ======
// Esta função recebe um texto (linha de código) e devolve ele envolto em <span> com classes CSS
function colorirCodigo(texto) {
  // Se não houver texto (linha vazia), retorna nada
  if (!texto) return "";

  // Transforma caracteres como < e > em entidades HTML para o navegador não tentar executá-los
  let html = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Expressão Regular (Regex) que busca:
  // 1. var, let ou const | 2. a palavra "name" | 3. o sinal de "=" | 4. textos entre aspas (strings)
  const regex = /\b(var|let|const)\b|\b(name)\b|(=)|(\".*?\"|\'.*?\')/g;

  // Substitui cada termo encontrado por um SPAN com uma classe específica para o CSS colorir
  return html.replace(regex, (match, p1, p2, p3, p4) => {
    if (p1) return `<span class="token-keyword">${p1}</span>`;   // Cores para var/let/const
    if (p2) return `<span class="token-variable">${p2}</span>`;  // Cores para o nome da variável
    if (p3) return `<span class="token-operator">${p3}</span>`;  // Cores para o sinal de igual
    if (p4) return `<span class="token-string">${p4}</span>`;    // Cores para o texto entre aspas
    return match; // Se não encaixar em nada, retorna o original
  });
}

// ====== FUNÇÃO PARA RENDERIZAR CARDS ======
// Pega o objeto 'dados' da API e transforma em elementos visuais no HTML
function renderizarCards(dados) {
  // Seleciona onde os cards vão aparecer
  const container = document.querySelector(".content");
  if (!container) return; // Segurança: se o container não existir, para a função
  
  // Limpa o conteúdo atual (remove o "Carregando...")
  container.innerHTML = "";

  // Cria o título principal da página (ex: "Variáveis em JS")
  const titulo = document.createElement("h1");
  titulo.textContent = dados.title;
  container.appendChild(titulo);

  // Percorre a lista de cards que veio da API
  dados.cards.forEach(card => {
    // Cria uma tag <section class="card"> para cada item
    const section = document.createElement("section");
    section.classList.add("card");

    // Lógica para cards do tipo EXPLANATION (só texto)
    if (card.type === "explanation") {
      const h2 = document.createElement("h2");
      h2.textContent = card.title;

      const p = document.createElement("p");
      p.textContent = card.description;

      section.appendChild(h2);
      section.appendChild(p);
    }

    // Lógica para cards do tipo EXAMPLE (código + botão copiar)
    if (card.type === "example") {
      const h2 = document.createElement("h2");
      h2.textContent = card.description;

      // Cria o botão de copiar
      const btnCopy = document.createElement("button");
      btnCopy.classList.add("btn-copy");
      btnCopy.textContent = "Copiar código";
      // Guarda o código puro dentro do botão (dataset) para usarmos depois no clique
      btnCopy.dataset.code = Array.isArray(card.code) ? card.code.join("\n") : card.code;

      // Cria o bloco cinza onde o código aparece
      const codeBlock = document.createElement("div");
      codeBlock.classList.add("code-block");
      
      // Garante que o código seja tratado como uma lista de linhas
      const linhas = Array.isArray(card.code) ? card.code : [card.code];
      linhas.forEach(linha => {
        const div = document.createElement("div");
        // Aqui usamos a função de colorir para cada linha
        div.innerHTML = colorirCodigo(linha);
        codeBlock.appendChild(div);
      });

      // Cria a parte que mostra o resultado esperado do código
      const result = document.createElement("div");
      result.classList.add("result");
      result.innerHTML = `Resultado: <strong>${card.value}</strong>`;

      // Monta a estrutura dentro da section
      section.appendChild(h2);
      section.appendChild(btnCopy);
      section.appendChild(codeBlock);
      section.appendChild(result);
    }

    // Adiciona o card completo ao container principal da página
    container.appendChild(section);
  });
}

// ====== EVENTO DE COPIAR ======
// Escuta cliques em qualquer lugar da página (Event Delegation)
document.addEventListener("click", async (e) => {
  // Verifica se o que foi clicado é o botão de copiar ou algo dentro dele
  const botao = e.target.closest(".btn-copy");
  if (!botao) return; // Se não for o botão, ignora o clique

  try {
    // Usa a API do navegador para escrever o texto na área de transferência (Clipboard)
    await navigator.clipboard.writeText(botao.dataset.code);
    
    // Feedback visual para o usuário
    const textoOriginal = botao.textContent;
    botao.textContent = "Copiado! ✅";
    
    // Volta o texto original do botão após 1.5 segundos
    setTimeout(() => botao.textContent = textoOriginal, 1500);
  } catch (err) {
    alert("Falha ao copiar o código");
    console.error(err);
  }
});

// ====== INICIA O CARREGAMENTO ======
// Chama a função principal assim que o script é lido
carregarPagina();



