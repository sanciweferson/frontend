async function carregarPagina() {
    try {
        const response = await fetch("https://bakend-f8o0.onrender.com/api/pages/var");
        
        // Verifica se a resposta foi bem sucedida antes de tentar transformar em JSON
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const dados = await response.json();
        renderizarCards(dados);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        document.querySelector(".content").innerHTML = `<p style="color:red">Erro ao carregar: ${erro.message}</p>`;
    }
}

// Função de estilização robusta
function colorirCodigo(texto) {
    if (!texto) return "";

    // Protege caracteres especiais de HTML
    let html = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Regex única para evitar conflitos de tags HTML
    const regex = /\b(var|let|const)\b|\b(name)\b|(=)|(\".*?\"|\'.*?\')/g;

    return html.replace(regex, (match, p1, p2, p3, p4) => {
        if (p1) return `<span class="token-keyword">${p1}</span>`; // var, let, const
        if (p2) return `<span class="token-variable">${p2}</span>`; // name
        if (p3) return `<span class="token-operator">${p3}</span>`; // =
        if (p4) return `<span class="token-string">${p4}</span>`;   // "Sanciweferson"
        return match;
    });
}

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
            const codigoFormatado = card.code.map(linha => {
                return `<div>${colorirCodigo(linha)}</div>`;
            }).join("");

            section.innerHTML = `
                <h2>${card.description}</h2>
                <div class="code-block">${codigoFormatado}</div>
                <div class="result">
                    // Resultado: <strong>${card.value}</strong>
                </div>
            `;
        }
        container.appendChild(section);
    });
}

// Inicia
carregarPagina();