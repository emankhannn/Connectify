// src/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchRecords = () => API.get("/records");
export const createRecord = (record) => API.post("/records", record);
export const updateRecord = (id, updatedRecord) => API.put(`/records/${id}`, updatedRecord);
export const deleteRecord = (id) => API.delete(`/records/${id}`);
export const callABC = (phone) => API.post("/call", { phone });
