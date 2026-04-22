"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imagenesRepository = require("./imagenes.repository");
const { httpError } = require("../../utils/http-error");
async function listByObra(req, res, next) {
    try {
        const result = await imagenesRepository.listImagenesByObra(req.params.obraId);
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function create(req, res, next) {
    try {
        const result = await imagenesRepository.createImagen(req.body);
        return res.status(201).json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function patch(req, res, next) {
    try {
        const result = await imagenesRepository.updateImagen(req.params.id, req.body);
        if (!result)
            throw httpError(404, "Imagen not found");
        return res.json(result);
    }
    catch (error) {
        return next(error);
    }
}
async function remove(req, res, next) {
    try {
        const ok = await imagenesRepository.deleteImagen(req.params.id);
        if (!ok)
            throw httpError(404, "Imagen not found");
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
}
module.exports = { listByObra, create, patch, remove };
