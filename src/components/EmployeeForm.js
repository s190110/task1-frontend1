import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { employeeValidationSchema } from "../validations/employeeValidationSchema";
import {
  fetchSkills,
  submitEmployee,
  fetchDepartmentsByWingId,
  fetchWings,
  updateEmployee,
} from "../services/api";
import "../css/EmployeeForm.css";

import { differenceInMonths } from "date-fns";

const EmployeeForm = ({ initialData = null, onSuccess, onCancel }) => {
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wings, setWings] = useState([]);
  const [totalExperience, setTotalExperience] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load skills and wings on mount
  useEffect(() => {
    fetchSkills().then((res) => {
      setSkillsOptions(
        res.data.map((skill) => ({
          value: skill.id,
          label: skill.name,
        }))
      );
    });
    fetchWings().then((res) => setWings(res.data));
  }, []);

  // Load departments if editing and wing already known
  useEffect(() => {
    if (initialData && initialData.wing && initialData.wing.id) {
      fetchDepartmentsByWingId(initialData.wing.id).then((res) =>
        setDepartments(res.data)
      );
    }
  }, [initialData]);

  // Initialize formik with initialData or empty
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      gender: initialData?.gender || "",
      dateOfBirth: initialData?.dateOfBirth || "",
      age: initialData?.age || "",
      dateOfJoined: initialData?.dateOfJoined || "",
      address: initialData?.address || "",
      skills:
        initialData?.skills?.map((s) => ({ value: s.id, label: s.name })) || [],
      wing: initialData?.wing?.id || "",
      department: initialData?.department?.id || "",
      hasExperience: initialData?.hasExperience ? "yes" : "no",
      experiences:
        initialData?.experiences?.length > 0
          ? initialData.experiences.map((exp) => ({
              location: exp.location || "",
              organization: exp.organization || "",
              fromDate: exp.fromDate || "",
              toDate: exp.toDate || "",
              experience: exp.experience || "",
            }))
          : [
              {
                location: "",
                organization: "",
                fromDate: "",
                toDate: "",
                experience: "",
              },
            ],
      totalExperience: initialData?.totalExperience || "",
      photo: initialData?.photo || "",
    },
    validationSchema: employeeValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        hasExperience: values.hasExperience === "yes",
        wing: { id: values.wing },
        department: { id: values.department },
        skills: values.skills.map((s) => ({ id: s.value })),
        totalExperience,
        photo: values.photo,
      };

      try {
        if (initialData && initialData.id) {
          // Update existing employee
          await updateEmployee(initialData.id, payload);
        } else {
          // Create new employee
          await submitEmployee(payload);
        }
        if (typeof onSuccess === "function") onSuccess();
      } catch (error) {
        console.error("Error submitting form:", error);
        // Optionally handle error state here
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Update age automatically on dateOfBirth change
  useEffect(() => {
    if (formik.values.dateOfBirth) {
      const dob = new Date(formik.values.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      formik.setFieldValue("age", age, false);
    }
  }, [formik.values.dateOfBirth]); // run whenever dateOfBirth changes

  // Calculate total experience months and years
  const calculateTotalExperience = (experiences) => {
    let totalMonths = 0;
    experiences.forEach((exp) => {
      if (exp.fromDate && exp.toDate) {
        const fromDate = new Date(exp.fromDate);
        const toDate = new Date(exp.toDate);
        if (!isNaN(fromDate) && !isNaN(toDate)) {
          totalMonths += differenceInMonths(toDate, fromDate);
        }
      }
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    setTotalExperience(`${years}y ${months}m`);
  };

  // Handle experience input changes
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

    formik.setFieldValue("experiences", updated, false);
    calculateTotalExperience(updated);
  };

  // Add experience
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

  // Remove experience
  const removeExperience = (index) => {
    const updated = [...formik.values.experiences];
    updated.splice(index, 1);
    formik.setFieldValue("experiences", updated, false);
    calculateTotalExperience(updated);
  };

  // Handle wing change & fetch departments
  const handleWingChange = async (e) => {
    const wingId = e.target.value;
    formik.setFieldValue("wing", wingId);
    formik.setFieldValue("department", "");
    if (wingId) {
      const res = await fetchDepartmentsByWingId(wingId);
      setDepartments(res.data);
    } else {
      setDepartments([]);
    }
  };

  // Handle photo upload and preview
  const handlePhotoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("photo", reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize photo preview if editing
  useEffect(() => {
    if (initialData && initialData.photo) {
      setPhotoPreview(initialData.photo);
    }
  }, [initialData]);

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>
          <u>{initialData ? "Edit Employee" : "Employee Registration Form"}</u>
        </h2>
      </div>
      <div className="employeeform">
        {/* First Name */}
        <div className="form-row" style={{ paddingTop: 20 }}>
          <label>First Name:</label>
          <input
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            required
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="error">{formik.errors.firstName}</div>
          )}
        </div>

        {/* Last Name */}
        <div className="form-row">
          <label>Last Name:</label>
          <input
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            required
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="error">{formik.errors.lastName}</div>
          )}
        </div>

        {/* Gender */}
        <div className="form-row">
          <label className="form-label">Gender:</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={formik.handleChange}
                checked={formik.values.gender === "Male"}
                required
              />
              Male
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={formik.handleChange}
                checked={formik.values.gender === "Female"}
              />
              Female
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="Others"
                onChange={formik.handleChange}
                checked={formik.values.gender === "Others"}
              />
              Others
            </label>
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <div className="error">{formik.errors.gender}</div>
          )}
        </div>

        {/* Date of Birth */}
        <div className="form-row">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dateOfBirth}
            required
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <div className="error">{formik.errors.dateOfBirth}</div>
          )}
        </div>

        {/* Age */}
        <div className="form-row">
          <label>Age:</label>
          <input name="age" value={formik.values.age} readOnly />
        </div>

        {/* Date of Joining */}
        <div className="form-row">
          <label>Date of Joining:</label>
          <input
            type="date"
            name="dateOfJoined"
            onChange={formik.handleChange}
            value={formik.values.dateOfJoined}
          />
          {formik.touched.dateOfJoined && formik.errors.dateOfJoined && (
            <div className="error">{formik.errors.dateOfJoined}</div>
          )}
        </div>

        {/* Address */}
        <div className="form-row">
          <label>Address:</label>
          <textarea
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
          ></textarea>
          {formik.touched.address && formik.errors.address && (
            <div className="error">{formik.errors.address}</div>
          )}
        </div>

        {/* Skills */}
        <div className="form-row">
          <label>Skills:</label>
          <div className="form-check d-flex flex-wrap gap-3">
            {skillsOptions.map((skill) => (
              <div key={skill.value}>
                <input
                  type="checkbox"
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
                />
                <label>{skill.label}</label>
              </div>
            ))}
          </div>
          {formik.touched.skills && formik.errors.skills && (
            <div className="error">{formik.errors.skills}</div>
          )}
        </div>

        {/* Wing and Department */}
        <div className="form-row">
          <label>Wing:</label>
          <select
            name="wing"
            value={formik.values.wing}
            onChange={handleWingChange}
          >
            <option value="">Select Wing</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {formik.touched.wing && formik.errors.wing && (
            <div className="error">{formik.errors.wing}</div>
          )}
        </div>

        <div className="form-row">
          <label>Department:</label>
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
          {formik.touched.department && formik.errors.department && (
            <div className="error">{formik.errors.department}</div>
          )}
        </div>

        {/* Experience Radio */}
        <div className="form-row">
          <label>Do you have any experience?</label>
          <label>
            <input
              type="radio"
              name="hasExperience"
              value="yes"
              onChange={(e) => {
                formik.handleChange(e);
                if (
                  !formik.values.experiences ||
                  formik.values.experiences.length === 0
                ) {
                  formik.setFieldValue("experiences", [
                    {
                      location: "",
                      organization: "",
                      fromDate: "",
                      toDate: "",
                      experience: "",
                    },
                  ]);
                  setTotalExperience("");
                }
              }}
              checked={formik.values.hasExperience === "yes"}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="hasExperience"
              value="no"
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue("experiences", []);
                setTotalExperience("");
              }}
              checked={formik.values.hasExperience === "no"}
            />
            No
          </label>
          {formik.touched.hasExperience && formik.errors.hasExperience && (
            <div className="error">{formik.errors.hasExperience}</div>
          )}
        </div>

        {/* Experience Fields */}
        {formik.values.hasExperience === "yes" && (
          <>
            <h5>Experience</h5>
            {formik.values.experiences.map((exp, index) => (
              <div key={index} className="experience-row">
                <div className="field-group">
                  <label htmlFor={`location-${index}`}>Location:</label>
                  <input
                    id={`location-${index}`}
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      handleExperienceChange(index, "location", e.target.value)
                    }
                  />
                  {formik.errors.experiences?.[index]?.location && (
                    <div className="error">
                      {formik.errors.experiences[index].location}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`organization-${index}`}>Organization:</label>
                  <input
                    id={`organization-${index}`}
                    placeholder="Organization"
                    value={exp.organization}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "organization",
                        e.target.value
                      )
                    }
                  />
                  {formik.errors.experiences?.[index]?.organization && (
                    <div className="error">
                      {formik.errors.experiences[index].organization}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`fromDate-${index}`}>From Date:</label>
                  <input
                    id={`fromDate-${index}`}
                    type="date"
                    value={exp.fromDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "fromDate", e.target.value)
                    }
                  />
                  {formik.errors.experiences?.[index]?.fromDate && (
                    <div className="error">
                      {formik.errors.experiences[index].fromDate}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor={`toDate-${index}`}>To Date:</label>
                  <input
                    id={`toDate-${index}`}
                    type="date"
                    value={exp.toDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "toDate", e.target.value)
                    }
                  />
                  {formik.errors.experiences?.[index]?.toDate && (
                    <div className="error">
                      {formik.errors.experiences[index].toDate}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  disabled={formik.values.experiences.length === 1}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-experience-btn"
              onClick={addExperience}
            >
              Add Experience
            </button>
          </>
        )}

        {/* Total Experience */}
        <div className="form-row" style={{ marginTop: 20 }}>
          Total Experience: {totalExperience}
        </div>

        {/* Photo Upload */}
        <div className="form-row">
          <label>Upload Photo:</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        {photoPreview && (
          <div className="form-row">
            <img
              src={photoPreview}
              alt="Preview"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            type="submit"
            className="btn btn-success"
            disabled={formik.isSubmitting}
          >
            {initialData ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              if (typeof onCancel === "function") onCancel();
              setTotalExperience("");
              setPhotoPreview(null);
            }}
            className="reset-btn"
            disabled={formik.isSubmitting}
          >
            Reset{" "}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
