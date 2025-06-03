import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEmployeeById = async (id) => {
    const res = await axios.get(`http://localhost:8080/api/employees/${id}`);
    setSelectedEmployee(res.data);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8080/api/employees");
      setEmployees(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Employees</h2>
      <table className="table table-bordered">
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
                <Button
                  variant="info"
                  onClick={() => fetchEmployeeById(emp.id)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <div>
              <p>
                <strong>First Name:</strong> {selectedEmployee.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedEmployee.lastName}
              </p>
              <p>
                <strong>Gender:</strong> {selectedEmployee.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedEmployee.dateOfBirth}
              </p>
              <p>
                <strong>Age:</strong> {selectedEmployee.age}
              </p>
              <p>
                <strong>Date Joined:</strong> {selectedEmployee.dateOfJoined}
              </p>
              <p>
                <strong>Address:</strong> {selectedEmployee.address}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {selectedEmployee.skills?.map((s) => s.name).join(", ") ||
                  "None"}
              </p>
              <p>
                <strong>Has Prior Experience:</strong>{" "}
                {selectedEmployee.hasExperience ? "Yes" : "No"}
              </p>

              {selectedEmployee.experiences?.length > 0 ? (
                <>
                  <h5>Experience</h5>
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Location</th>
                        <th>Organization</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.experiences.map((exp, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{exp.location}</td>
                          <td>{exp.organization}</td>
                          <td>{exp.fromDate}</td>
                          <td>{exp.toDate}</td>
                          <td>{exp.experience}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>No experience records found.</p>
              )}

              <p>
                <strong>Total Experience:</strong>{" "}
                {selectedEmployee.totalExperience}
              </p>

              {selectedEmployee.photo && (
                <div>
                  <strong>Photo:</strong>
                  <br />
                  <img
                    src={selectedEmployee.photo}
                    alt="Employee"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
