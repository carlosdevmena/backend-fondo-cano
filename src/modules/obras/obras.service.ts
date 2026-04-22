const obrasRepository = require("./obras.repository");
const { httpError } = require("../../utils/http-error");

async function list(filters) {
  return obrasRepository.listObras(filters);
}

async function getById(id) {
  const obra = await obrasRepository.getObraById(id);
  if (!obra) {
    throw httpError(404, "Obra not found");
  }
  return obra;
}

async function create(payload) {
  try {
    return await obrasRepository.createObra(payload);
  } catch (error) {
    if (error.code === "23505") {
      throw httpError(409, "Obra id already exists");
    }
    throw error;
  }
}

async function patch(id, payload) {
  if (payload.id) {
    delete payload.id;
  }
  const updated = await obrasRepository.updateObra(id, payload);
  if (!updated) {
    throw httpError(404, "Obra not found");
  }
  return updated;
}

async function remove(id) {
  const deleted = await obrasRepository.deleteObra(id);
  if (!deleted) {
    throw httpError(404, "Obra not found");
  }
}

async function facets() {
  return obrasRepository.getFacets();
}

module.exports = { list, getById, create, patch, remove, facets };
