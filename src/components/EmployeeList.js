import React, { useEffect, useState } from "react";
import { fetchEmployees } from "../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8080/api/employees");

      console.log("The Response :: ", response?.data);

      setEmployees(response?.data);
    };

    fetchData();
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
          {employees?.length > 0 &&
            employees?.map((emp, index) => {
              return (
                <tr key={emp?.id}>
                  <td>{index + 1}</td>
                  <td>
                    {emp?.firstName} {emp?.lastName}
                  </td>
                  <td>
                    <button onClick={() => navigate(`/employees/${emp.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
