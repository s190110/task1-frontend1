import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import EmployeeForm from "./EmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open modal to edit employee, passing the existing employee data
  const handleEditClick = (employee) => {
    setEditEmployeeData(employee);
    setShowModal(true);
  };

  // Open modal to view employee details
  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  // Close modal and reset edit data
  const handleCloseModal = () => {
    setShowModal(false);
    setEditEmployeeData(null);
    setSelectedEmployee(null);
  };

  // Callback from EmployeeForm on successful submit to refresh list and close modal
  const handleFormSubmitSuccess = () => {
    fetchEmployees();
    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      <h2>Employees</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
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
                  className="me-2"
                  onClick={() => handleViewClick(emp)}
                >
                  View
                </Button>
                <Button variant="warning" onClick={() => handleEditClick(emp)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEmployee ? "Employee Details" : "Edit Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <div
              className="d-flex flex-wrap align-items-start"
              style={{ gap: "10px" }}
            >
              <div style={{ flex: 1, minWidth: "250px" }}>
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
              </div>

              {/* Right side - Photo */}
              {selectedEmployee.photo && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                    Photo:
                  </div>
                  <img
                    src={selectedEmployee.photo}
                    alt="Employee"
                    style={{
                      width: "160px",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {editEmployeeData && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmployeeForm
              initialData={editEmployeeData}
              onSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseModal}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeList;
