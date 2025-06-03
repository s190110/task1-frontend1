// import React, { useEffect, useState } from "react";
// import { fetchEmployeeById } from "../services/api";
// import { useParams } from "react-router-dom";

// const EmployeeDetails = () => {
//   const { id } = useParams();
//   const [employee, setEmployee] = useState(null);

//   useEffect(() => {
//     fetchEmployeeById(id).then((res) => setEmployee(res.data));
//   }, [id]);

//   if (!employee) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Employee Details</h2>
//       <p>
//         <strong>First Name:</strong> {employee.firstName}
//       </p>
//       <p>
//         <strong>Last Name:</strong> {employee.lastName}
//       </p>
//       <p>
//         <strong>Gender:</strong> {employee.gender}
//       </p>
//       <p>
//         <strong>Date of Birth:</strong> {employee.dateOfBirth}
//       </p>
//       <p>
//         <strong>Age:</strong> {employee.age}
//       </p>
//       <p>
//         <strong>Date Joined:</strong> {employee.dateOfJoined}
//       </p>
//       <p>
//         <strong>Address:</strong> {employee.address}
//       </p>
//       <p>
//         <strong>Skills:</strong>{" "}
//         {employee.skills?.map((s) => s.name).join(", ") || "None"}
//       </p>

//       {/* ✅ Display hasExperience */}
//       <p>
//         <strong>Has Prior Experience:</strong>{" "}
//         {employee.hasExperience ? "Yes" : "No"}
//       </p>

//       <h3>Experience</h3>
//       {employee.experiences?.length > 0 ? (
//         <table border="1" cellPadding="5">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Location</th>
//               <th>Organization</th>
//               <th>From</th>
//               <th>To</th>
//               <th>Experience</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employee.experiences.map((exp, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{exp.location}</td>
//                 <td>{exp.organization}</td>
//                 <td>{exp.fromDate}</td>
//                 <td>{exp.toDate}</td>
//                 <td>{exp.experience}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No experience records found.</p>
//       )}

//       <p>
//         <strong>Total Experience:</strong> {employee?.totalExperience}
//       </p>

//       {employee.photo && (
//         <div>
//           <strong>Photo:</strong>
//           <br />
//           <img
//             src={employee.photo}
//             alt="Employee"
//             style={{ width: "150px", height: "150px", objectFit: "cover" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeDetails;
