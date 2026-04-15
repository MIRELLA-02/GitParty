const prisma = require("../data/prisma");

const limiteInscricoes = async (eventosId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventosId },
        include: { inscricoes: true }
    });

    const numeroInscricoes = evento.inscricoes
        .filter(i => i.status === "CONFIRMADA").length;

    if (numeroInscricoes >= evento.capacidade_maxima) { 
        return "LISTA_ESPERA";
    }

    return "";
};

const inscricaoDuplicada = async (usuarioId, eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: { inscricoes: true }
    });

    const inscrito = evento.inscricoes
        .filter(i => i.usuariosId == usuarioId).length;

    if (inscrito >= 1) { 
        throw new Error("Usuário já inscrito no evento!");
    }
};

const prazoCancelamento = async (usuarioId, eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId } 
    });

    const agora = new Date();
    const dataEvento = new Date(evento.data_evento);

    const diferencaHoras = (dataEvento - agora) / (1000 * 60 * 60);

    if (diferencaHoras >= 24) {
        return "CONFIRMADO"; 
    }

    return "PRAZO_DE_CANCELAMENTO_EXPIRADO"; 
};

const listaEspera = async (eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: { inscricoes: true }
    });

    const proximo = evento.inscricoes.find(
        i => i.status === "LISTA_ESPERA"
    );

    if (proximo) {
        await prisma.inscricoes.update({
            where: { id: proximo.id },
            data: { status: "CONFIRMADA" }
        });
    }
};

const excluirEvento = async (eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: { inscricoes: true }
    });

    if (!evento) return "EVENTO_NAO_ENCONTRADO";

    if (new Date() > new Date(evento.data_evento)) {
        return "EVENTO_JA_ACONTECEU";
    }

    if (evento.inscricoes.length > 0) { 
        return "EVENTO_TEM_PARTICIPANTES";
    }

    return "CONFIRMADO";
};

const encerrarEvento = async (eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId }
    });

    const agora = new Date();
    const dataEvento = new Date(evento.data_evento);

    if (agora > dataEvento) {
        await prisma.inscricoes.updateMany({
            where: {
                eventosId: eventoId, 
                status: "LISTA_ESPERA"
            },
            data: {
                status: "CANCELADA"
            }
        });
    }
};

module.exports = {
    limiteInscricoes,
    inscricaoDuplicada,
    prazoCancelamento, 
    listaEspera,
    encerrarEvento,
    excluirEvento
};