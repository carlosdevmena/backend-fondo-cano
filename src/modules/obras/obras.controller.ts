const obrasService = require("./obras.service");

async function list(req, res, next) {
  try {
    const result = await obrasService.list(req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const result = await obrasService.getById(req.params.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await obrasService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function patch(req, res, next) {
  try {
    const result = await obrasService.patch(req.params.id, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await obrasService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function facets(req, res, next) {
  try {
    const result = await obrasService.facets();
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, getById, create, patch, remove, facets };
