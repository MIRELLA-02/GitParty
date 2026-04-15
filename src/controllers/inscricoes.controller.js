const prisma = require("../data/prisma");
const { limiteInscricoes, inscricaoDuplicada, prazoCancelamento, listaEspera } = require("../services/inscricoes.services");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        await inscricaoDuplicada(data.usuariosId, data.eventosId);

        const status = await limiteInscricoes(data.eventosId);

        if (status) data.status = status; 

        const item = await prisma.inscricoes.create({
            data
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json(error.toString());
    }
};

async function listar(req, res) {
    try {
        const lista = await prisma.inscricoes.findMany();
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json(error.toString());
    }
}

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.inscricoes.findUnique({
            where: { id: Number(id) }
        });

        if (!item) {
            return res.status(404).json("Inscrição não encontrada");
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json(error.toString());
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.inscricoes.update({
            where: { id: Number(id) },
            data: dados
        });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json(error.toString());
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const inscricao = await prisma.inscricoes.findUnique({
            where: { id: Number(id) }
        });

        if (!inscricao) {
            return res.status(404).json("Inscrição não encontrada!");
        }

        const status = await prazoCancelamento(
            inscricao.usuariosId,
            inscricao.eventosId
        );

        if (status !== "CONFIRMADO") {
            return res.status(400).json(status); 
        }

        await prisma.inscricoes.delete({
            where: { id: Number(id) }
        });

        await listaEspera(inscricao.eventosId);

        res.status(200).json("Cancelado com sucesso!");
    } catch (error) {
        res.status(500).json(error.toString());
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};