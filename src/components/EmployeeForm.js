import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { fetchSkills, submitEmployee } from "../services/api";
import { fetchDepartmentsByWingId } from "../services/api";
import { fetchWings } from "../services/api";

const EmployeeForm = () => {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [wings, setWings] = useState([]);

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
      </div>

      <button type="submit">Submit</button>

      {submitted && <p>Employee submitted!</p>}
    </form>
  );
};

export default EmployeeForm;
