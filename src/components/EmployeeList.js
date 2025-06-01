import React, { useEffect, useState } from "react";
import { fetchEmployees } from "../services/api";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees().then((res) => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td>
              <td>
                {emp.firstName} {emp.lastName}
              </td>
              <td>
                <button onClick={() => navigate(`/employees/${emp.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
