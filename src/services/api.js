import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const fetchSkills = () => API.get("/skills");
export const fetchEmployees = () => API.get("/employees");
export const fetchEmployeeById = (id) => API.get(`/employees/${id}`);
export const submitEmployee = (data) => API.post("/employees", data);
