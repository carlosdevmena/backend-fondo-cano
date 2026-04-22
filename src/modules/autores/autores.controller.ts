const autoresRepository = require("./autores.repository");
const { httpError } = require("../../utils/http-error");

async function list(req, res, next) {
  try {
    const result = await autoresRepository.listAutores();
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const result = await autoresRepository.getAutorById(req.params.id);
    if (!result) throw httpError(404, "Autor not found");
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await autoresRepository.createAutor(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function patch(req, res, next) {
  try {
    const result = await autoresRepository.updateAutor(req.params.id, req.body);
    if (!result) throw httpError(404, "Autor not found");
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await autoresRepository.deleteAutor(req.params.id);
    if (!ok) throw httpError(404, "Autor not found");
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, getById, create, patch, remove };
