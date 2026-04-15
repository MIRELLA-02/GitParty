const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadImagem");

const {
  cadastrar,
  listar,
  buscar,
  atualizar,
  excluir,
} = require("../controllers/imagens.controller");

router.post("/cadastrar/:id", cadastrar);
router.get("/listar", listar);


module.exports = router;