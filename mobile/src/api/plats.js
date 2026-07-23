import api from "./axios";

/**
 * @typedef {Object} Plat
 * @property {number} id
 * @property {string} nom
 * @property {number} prix
 * @property {string} categorie
 * @property {boolean} disponible
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} PlatInput
 * @property {string} nom
 * @property {number} prix
 * @property {string} categorie
 * @property {boolean} [disponible]
 */

/** @returns {Promise<Plat[]>} */
export async function getPlats() {
  const { data } = await api.get("/plats");
  return data;
}

/**
 * @param {number|string} id
 * @returns {Promise<Plat>}
 */
export async function getPlat(id) {
  const { data } = await api.get(`/plats/${id}`);
  return data;
}

/**
 * @param {PlatInput} plat
 * @returns {Promise<Plat>}
 */
export async function createPlat(plat) {
  const { data } = await api.post("/plats", plat);
  return data;
}

/**
 * @param {number|string} id
 * @param {Partial<PlatInput>} plat
 * @returns {Promise<Plat>}
 */
export async function updatePlat(id, plat) {
  const { data } = await api.put(`/plats/${id}`, plat);
  return data;
}

/**
 * @param {number|string} id
 * @returns {Promise<number|string>}
 */
export async function deletePlat(id) {
  await api.delete(`/plats/${id}`);
  return id;
}
