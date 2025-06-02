import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import {
  fetchSkills,
  submitEmployee,
  fetchDepartmentsByWingId,
  fetchWings,
} from "../services/api";
import { differenceInMonths } from "date-fns";

const EmployeeForm = () => {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [wings, setWings] = useState([]);
  const [totalExperience, setTotalExperience] = useState("");

  useEffect(() => {
    fetchSkills().then((res) => {
      setSkillsOptions(
        res.data.map((skill) => ({
          value: skill.id,
          label: skill.name,
        }))
      );
    });
  }, []);

  useEffect(() => {
    fetchWings()
      .then((res) => setWings(res.data))
      .catch((err) => console.error(err));
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      age: "",
      dateOfJoined: "",
      address: "",
      skills: [],
      wing: "",
      department: "",
      experiences: [
        {
          location: "",
          organization: "",
          fromDate: "",
          toDate: "",
          experience: "",
        },
      ],
      totalExperience: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      dateOfBirth: Yup.date().required("Required"),
      dateOfJoined: Yup.date().required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        wing: { id: values.wing },
        department: { id: values.department },
        skills: values.skills.map((s) => ({ id: s.value })),
        totalExperience: totalExperience,
      };
      await submitEmployee(payload);
      setSubmitted(true);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (formik.values.dateOfBirth) {
      const dob = new Date(formik.values.dateOfBirth);
      const ageDiff = new Date().getFullYear() - dob.getFullYear();
      formik.setFieldValue("age", ageDiff);
    }
  }, [formik.values.dateOfBirth]);

  const calculateTotalExperience = (experiences) => {
    let totalMonths = 0;

    experiences.forEach((exp) => {
      if (exp.fromDate && exp.toDate) {
        const fromDate = new Date(exp.fromDate);
        const toDate = new Date(exp.toDate);
        if (!isNaN(fromDate) && !isNaN(toDate)) {
          const months = differenceInMonths(toDate, fromDate);
          totalMonths += months;
        }
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    setTotalExperience(`${years}y ${months}m`);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formik.values.experiences];
    updated[index][field] = value;

    if (updated[index].fromDate && updated[index].toDate) {
      const fromDate = new Date(updated[index].fromDate);
      const toDate = new Date(updated[index].toDate);
      if (!isNaN(fromDate) && !isNaN(toDate)) {
        const months = differenceInMonths(toDate, fromDate);
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        updated[index].experience = `${years}y ${remMonths}m`;
      } else {
        updated[index].experience = "";
      }
    }

    formik.setFieldValue("experiences", updated);
    calculateTotalExperience(updated); // ⬅️ Recalculate total
  };

  const addExperience = () => {
    formik.setFieldValue("experiences", [
      ...formik.values.experiences,
      { location: "", organization: "", from: "", to: "", experience: "" },
    ]);
  };

  const removeExperience = (index) => {
    const updated = [...formik.values.experiences];
    updated.splice(index, 1);
    formik.setFieldValue("experiences", updated);
    calculateTotalExperience(updated); // ⬅️ Recalculate total
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label>First Name</label>
        <input
          name="firstName"
          onChange={formik.handleChange}
          value={formik.values.firstName}
        />
      </div>

      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          onChange={formik.handleChange}
          value={formik.values.lastName}
        />
      </div>

      <div>
        <label>Gender</label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            onChange={formik.handleChange}
          />{" "}
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            onChange={formik.handleChange}
          />{" "}
          Female
        </label>
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          onChange={formik.handleChange}
          value={formik.values.dateOfBirth}
        />
      </div>

      <div>
        <label>Age</label>
        <input name="age" value={formik.values.age} readOnly />
      </div>

      <div>
        <label>Date of Joining</label>
        <input
          type="date"
          name="dateOfJoined"
          onChange={formik.handleChange}
          value={formik.values.dateOfJoined}
        />
      </div>

      <div>
        <label>Address</label>
        <textarea
          name="address"
          onChange={formik.handleChange}
          value={formik.values.address}
        ></textarea>
      </div>

      <div>
        <label>Skills</label>
        <Select
          isMulti
          options={skillsOptions}
          value={formik.values.skills}
          onChange={(value) => formik.setFieldValue("skills", value)}
        />
      </div>

      <div>
        <div>
          <label>Wing</label>
          <select
            name="wing"
            value={formik.values.wing}
            onChange={async (e) => {
              const selectedWingId = e.target.value;
              formik.setFieldValue("wing", selectedWingId);
              formik.setFieldValue("department", "");
              const res = await fetchDepartmentsByWingId(selectedWingId);
              setDepartments(res.data);
            }}
          >
            <option value="">Select Wing</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Department</label>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3>Experience</h3>
          {formik.values.experiences.map((exp, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Serial No:</strong> {index + 1}
              </p>

              <label>Location:</label>
              <input
                name={`experiences.${index}.location`}
                value={exp.location}
                onChange={(e) =>
                  handleExperienceChange(index, "location", e.target.value)
                }
              />

              <label>Organization:</label>
              <input
                name={`experiences.${index}.organization`}
                value={exp.organization}
                onChange={(e) =>
                  handleExperienceChange(index, "organization", e.target.value)
                }
              />

              <label>From:</label>
              <input
                type="date"
                name={`experiences.${index}.fromDate`}
                value={exp.fromDate}
                onChange={(e) =>
                  handleExperienceChange(index, "fromDate", e.target.value)
                }
              />

              <label>To:</label>
              <input
                type="date"
                name={`experiences.${index}.toDate`}
                value={exp.toDate}
                onChange={(e) =>
                  handleExperienceChange(index, "toDate", e.target.value)
                }
              />

              <p>
                <strong>Experience:</strong> {exp.experience}
              </p>

              <button
                type="button"
                onClick={() => removeExperience(index)}
                style={{ color: "red" }}
              >
                Delete Row
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            style={{ marginTop: "10px" }}
          >
            Add Experience
          </button>
        </div>

        <p>
          <strong>Total Experience:</strong> {totalExperience}
        </p>
      </div>

      <button type="submit">Submit</button>

      {submitted && <p>Employee submitted!</p>}
    </form>
  );
};

export default EmployeeForm;
