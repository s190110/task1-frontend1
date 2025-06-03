import * as Yup from "yup";

export const employeeValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  dateOfJoined: Yup.date().required("Date of Joining is required"),
  address: Yup.string().required("Address is required"),
  skills: Yup.array()
    .min(1, "Select at least one skill")
    .of(
      Yup.object().shape({
        value: Yup.number().required(),
        label: Yup.string().required(),
      })
    ),
  wing: Yup.string().required("Wing is required"),
  department: Yup.string().required("Department is required"),
  hasExperience: Yup.string().required("Please select if you have experience"),

  experiences: Yup.array().when("hasExperience", {
    is: "yes",
    then: (schema) =>
      schema.of(
        Yup.object().shape({
          location: Yup.string().required("Location is required"),
          organization: Yup.string().required("Organization is required"),
          fromDate: Yup.date().required("From Date is required"),
          toDate: Yup.date()
            .required("To Date is required")
            .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
        })
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  photo: Yup.string().nullable(),
});
