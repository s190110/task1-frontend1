import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/EmployeeForm.css";
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
  const [photoPreview, setPhotoPreview] = useState(null);

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
      hasExperience: "",
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
      photo: "",
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
        hasExperience: values.hasExperience === "yes",
        wing: { id: values.wing },
        department: { id: values.department },
        skills: values.skills.map((s) => ({ id: s.value })),
        totalExperience: totalExperience,
        photo: values.photo,
      };
      await submitEmployee(payload);
      setSubmitted(true);

      formik.resetForm();
    },
  });

  useEffect(() => {
    if (formik.values.dateOfBirth) {
      const dob = new Date(formik.values.dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      formik.setFieldValue("age", age);
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
    if (formik.values.experiences.length >= 5) {
      alert("You can only add up to 5 experiences.");
      return;
    }

    formik.setFieldValue("experiences", [
      ...formik.values.experiences,
      {
        location: "",
        organization: "",
        fromDate: "",
        toDate: "",
        experience: "",
      },
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
      <div className="employeeform">
        <div className="form-row">
          <label>First Name : </label>
          <input
            name="firstName"
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />
        </div>

        <div className="form-row">
          <label>Last Name :</label>
          <input
            name="lastName"
            onChange={formik.handleChange}
            value={formik.values.lastName}
          />
        </div>

        <div className="form-row">
          <label>Gender :</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={formik.handleChange}
              checked={formik.values.gender === "Male"}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={formik.handleChange}
              checked={formik.values.gender === "Female"}
            />{" "}
            Female
          </label>
        </div>

        <div className="form-row">
          <label>Date of Birth :</label>
          <input
            type="date"
            name="dateOfBirth"
            onChange={formik.handleChange}
            value={formik.values.dateOfBirth}
          />
        </div>

        <div className="form-row">
          <label>Age :</label>
          <input name="age" value={formik.values.age} readOnly />
        </div>

        <div className="form-row">
          <label>Date of Joining :</label>
          <input
            type="date"
            name="dateOfJoined"
            onChange={formik.handleChange}
            value={formik.values.dateOfJoined}
          />
        </div>

        <div className="form-row">
          <label>Address :</label>
          <textarea
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
          ></textarea>
        </div>

        <div className="form-row">
          <label>Skills:</label>
          <div className="form-check d-flex flex-wrap gap-3">
            {skillsOptions.map((skill) => (
              <div key={skill.value} className="form-check">
                <input
                  type="checkbox"
                  id={skill.value}
                  name="skills"
                  value={skill.value}
                  checked={formik.values.skills.some(
                    (s) => s.value === skill.value
                  )}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const selectedSkills = formik.values.skills;

                    if (checked) {
                      formik.setFieldValue("skills", [
                        ...selectedSkills,
                        skill,
                      ]);
                    } else {
                      formik.setFieldValue(
                        "skills",
                        selectedSkills.filter((s) => s.value !== skill.value)
                      );
                    }
                  }}
                  className="form-check-input"
                />
                <label htmlFor={skill.value} className="form-check-label">
                  {skill.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Wing :</label>
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

        <div className="form-row">
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
        <div className="form-row">
          <label>Do you have any experience?</label>
          <div>
            <label>
              <input
                type="radio"
                name="hasExperience"
                value="yes"
                onChange={formik.handleChange}
                checked={formik.values.hasExperience === "yes"}
              />{" "}
              Yes
            </label>
            <label className="ms-3">
              <input
                type="radio"
                name="hasExperience"
                value="no"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("experiences", []); // Clear experience if "No"
                  setTotalExperience("");
                }}
                checked={formik.values.hasExperience === "no"}
              />{" "}
              No
            </label>
          </div>
        </div>

        {formik.values.hasExperience === "yes" && (
          <div>
            <div>
              <h5>Experience</h5>
              <div className="experience-headings d-flex align-items-center gap-2 mb-2 fw-bold">
                <span style={{ width: "20px" }}></span>{" "}
                <span style={{ flex: 1 }}>Location</span>
                <span style={{ flex: 1 }}>Organization</span>
                <span style={{ flex: 1 }}>From Date</span>
                <span style={{ flex: 1 }}>To Date</span>
                <span style={{ width: "80px" }}></span>
              </div>

              {formik.values.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="experience-row d-flex align-items-center gap-2 mb-2"
                >
                  <strong>{index + 1}.</strong>

                  <input
                    placeholder="Location"
                    name={`experiences.${index}.location`}
                    value={exp.location}
                    onChange={(e) =>
                      handleExperienceChange(index, "location", e.target.value)
                    }
                  />

                  <input
                    placeholder="Organization"
                    name={`experiences.${index}.organization`}
                    value={exp.organization}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "organization",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="date"
                    name={`experiences.${index}.fromDate`}
                    value={exp.fromDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "fromDate", e.target.value)
                    }
                  />

                  <input
                    type="date"
                    name={`experiences.${index}.toDate`}
                    value={exp.toDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "toDate", e.target.value)
                    }
                  />

                  <div className="experience-actions">
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end mt-2">
              <button
                type="button"
                onClick={addExperience}
                className="btn btn-m btn-outline-primary"
              >
                Add Experience
              </button>
            </div>
          </div>
        )}

        <div className="form-row">Total Experience : {totalExperience}</div>
        <div className="form-row">
          <label>Upload Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  formik.setFieldValue("photo", reader.result);
                  setPhotoPreview(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {photoPreview && (
          <div className="form-row">
            <label>Preview:</label>
            <img
              src={photoPreview}
              alt="Employee"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 300,
            marginTop: "1rem",
          }}
        >
          <button type="submit" className="btn btn-success mt-3">
            Submit
          </button>

          <button
            type="button"
            className="btn btn-secondary mt-3 ml-2"
            onClick={() => {
              formik.resetForm();
              setSubmitted(false);
              setTotalExperience("");
            }}
          >
            Reset
          </button>
        </div>

        {submitted && alert(<p>Employee submitted!</p>)}
      </div>
    </form>
  );
};

export default EmployeeForm;
