import instance from "./config.js";

async function getFilms(params = {}) {
  return await instance.get("films", { params });
}

async function getFilmById(id) {
  return await instance.get(`films/${id}`);
}

async function getSelectionOfficielle() {
  return await instance.get("films/selection-officielle");
}

async function updateFilmStatus(id, data) {
  return await instance.patch(`films/${id}/status`, data);
}

export { getFilms, getFilmById, getSelectionOfficielle, updateFilmStatus };
