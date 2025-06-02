import axios from "axios";
import { useEffect } from "react";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// const [employee, setEmployee] = useState([]);
// useEffect = () => {
//   fetchdata = async () => {
//     const res = await axios.get("https://jsonplaceholder.typicode");

//     setEmployee(res.data);
//   };
// };

export const fetchWings = () => API.get("/wings");
export const fetchDepartmentsByWingId = (id) =>
  API.get(`/wings/${id}/departments`);
export const fetchSkills = () => API.get("/skills");
export const fetchEmployees = () => API.get("/employees");
export const fetchEmployeeById = (id) => API.get(`/employees/${id}`);
export const submitEmployee = (data) => API.post("/employees", data);
