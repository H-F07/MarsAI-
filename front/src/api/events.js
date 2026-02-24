import instance from "./config.js";

async function getEvents() {
  return await instance.get("events");
}

async function getEventById(id) {
  return await instance.get(`events/${id}`);
}

async function createEvent(eventData) {
  return await instance.post("events", eventData);
}

async function updateEvent(id, eventData) {
  return await instance.put(`events/${id}`, eventData);
}

async function deleteEvent(id) {
  return await instance.delete(`events/${id}`);
}

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
