import React, { useEffect, useState } from "react";
import { fetchEmployeeById } from "../services/api";
import { useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeById(id).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  return (
    <div>
      <h2>Employee Details</h2>
      <p>
        <strong>First Name:</strong> {employee.firstName}
      </p>
      <p>
        <strong>Last Name:</strong> {employee.lastName}
      </p>
      <p>
        <strong>Gender:</strong> {employee.gender}
      </p>
      <p>
        <strong>Date of Birth:</strong> {employee.dateOfBirth}
      </p>
      <p>
        <strong>Age:</strong> {employee.age}
      </p>
      <p>
        <strong>Date Joined:</strong> {employee.dateOfJoined}
      </p>
      <p>
        <strong>Address:</strong> {employee.address}
      </p>
      <p>
        <strong>Skills:</strong> {employee.skills.map((s) => s.name).join(", ")}
      </p>
    </div>
  );
};

export default EmployeeDetails;
