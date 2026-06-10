const apiUrl = "http://localhost:3000/eventos";

const containerEventos = document.getElementById("containerEventos");

const modal = document.getElementById("modalEvento");
const abrirModalBtn = document.getElementById("abrirModal");
const fecharModalBtn = document.getElementById("fecharModal");

const formEvento = document.getElementById("formEvento");



// =========================
// MODAL
// =========================

function abrirModal() {

    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

}

function fecharModal() {

    if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    }

}

if (abrirModalBtn) {

    abrirModalBtn.addEventListener("click", abrirModal);

}

if (fecharModalBtn) {

    fecharModalBtn.addEventListener("click", fecharModal);

}

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        fecharModal();

    }

});



// =========================
// BUSCAR EVENTOS
// =========================

async function buscarEventos() {

    try {

        const resposta = await fetch(apiUrl);

        const eventos = await resposta.json();

        mostrarEventos(eventos);

    } catch (erro) {

        console.log("Erro ao buscar eventos");
        console.log(erro);

    }

}



// =========================
// MOSTRAR EVENTOS
// =========================

function mostrarEventos(eventos) {

    if (!containerEventos) return;

    containerEventos.innerHTML = "";

    eventos.forEach((evento) => {

        const card = document.createElement("div");

        card.className =
            "leather-card p-6 flex flex-col justify-between min-h-[220px] transition-all hover:-translate-y-1";

        const data = new Date(evento.data_evento)
            .toLocaleDateString("pt-BR");

        card.innerHTML = `
        
            <div class="flex justify-between items-start">

                <span class="bg-primary-container text-secondary-container text-label-sm px-3 py-1 rounded">
                    ${evento.status}
                </span>

                <span class="material-symbols-outlined text-secondary-container">
                    calendar_today
                </span>

            </div>

            <div>

                <h3 class="text-headline-lg font-headline-lg text-surface-bright mb-2">
                    ${evento.titulo}
                </h3>

                <p class="text-secondary-container font-bold text-body-md">
                    ${data}
                </p>

                <button 
                    class="btn-detalhes mt-4 w-full bg-secondary text-on-secondary py-2 px-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
                    data-id="${evento.id}"
                >
                    Ver Detalhes
                </button>

            </div>
        `;

        containerEventos.appendChild(card);

    });

    abrirDetalhes();

}



// =========================
// ABRIR DETALHES
// =========================

function abrirDetalhes() {

    const botoes = document.querySelectorAll(".btn-detalhes");

    botoes.forEach((botao) => {

        botao.addEventListener("click", () => {

            const id = botao.dataset.id;

            window.location.href = `descricao.html?id=${id}`;

        });

    });

}



// =========================
// CADASTRAR EVENTO
// =========================

if (formEvento) {

    formEvento.addEventListener("submit", async (e) => {

        e.preventDefault();

        const novoEvento = {

            titulo: document.getElementById("tituloEvento").value,

            descricao: document.getElementById("descricaoEvento").value,

            data_evento: document.getElementById("dataEvento").value,

            local: document.getElementById("localEvento").value,

            capacidade_maxima: Number(
                document.getElementById("capacidadeEvento").value
            ),

            status: document.getElementById("statusEvento").value

        };

        try {

            const resposta = await fetch(apiUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(novoEvento)

            });

            if (resposta.ok) {

                alert("Evento cadastrado com sucesso!");

                formEvento.reset();

                fecharModal();

                buscarEventos();

            } else {

                alert("Erro ao cadastrar evento");

            }

        } catch (erro) {

            console.log("Erro ao cadastrar evento");
            console.log(erro);

        }

    });

}



// =========================
// CARREGAR DETALHES
// =========================

async function carregarEvento() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) return;

    try {

        const resposta = await fetch(`${apiUrl}/${id}`);

        const evento = await resposta.json();

        const titulo = document.getElementById("tituloDetalhe");
        const descricao = document.getElementById("descricaoDetalhe");
        const data = document.getElementById("dataDetalhe");
        const local = document.getElementById("localDetalhe");
        const capacidade = document.getElementById("capacidadeDetalhe");
        const status = document.getElementById("statusDetalhe");

        if (titulo) {

            titulo.textContent = evento.titulo;

        }

        if (descricao) {

            descricao.textContent = evento.descricao;

        }

        if (data) {

            data.textContent = new Date(evento.data_evento)
                .toLocaleDateString("pt-BR");

        }

        if (local) {

            local.textContent = evento.local;

        }

        if (capacidade) {

            capacidade.textContent = evento.capacidade_maxima;

        }

        if (status) {

            status.textContent = evento.status;

        }

    } catch (erro) {

        console.log("Erro ao carregar evento");
        console.log(erro);

    }

}



// =========================
// INICIAR
// =========================

buscarEventos();

carregarEvento();