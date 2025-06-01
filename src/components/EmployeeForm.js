import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { fetchSkills, submitEmployee } from "../services/api";

const EmployeeForm = () => {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

      <button type="submit">Submit</button>

      {submitted && <p>Employee submitted!</p>}
    </form>
  );
};

export default EmployeeForm;
