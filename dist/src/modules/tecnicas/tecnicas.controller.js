"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tecnicasRepository = require("./tecnicas.repository");
const { httpError } = require("../../utils/http-error");
async function list(req, res, next) {
    try {
        const result = await tecnicasRepository.listTecnicas();
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function getById(req, res, next) {
    try {
        const result = await tecnicasRepository.getTecnicaById(req.params.id);
        if (!result)
            throw httpError(404, "Tecnica not found");
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function create(req, res, next) {
    try {
        const result = await tecnicasRepository.createTecnica(req.body);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error.code === "23505") {
            return next(httpError(409, "Tecnica already exists"));
        }
        return next(error);
    }
}
async function patch(req, res, next) {
    try {
        const result = await tecnicasRepository.updateTecnica(req.params.id, req.body);
        if (!result)
            throw httpError(404, "Tecnica not found");
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function remove(req, res, next) {
    try {
        const ok = await tecnicasRepository.deleteTecnica(req.params.id);
        if (!ok)
            throw httpError(404, "Tecnica not found");
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
module.exports = { list, getById, create, patch, remove };
