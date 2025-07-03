import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
    identifier: Yup.string().required("Email/Phone is Required"),
    password: Yup.string().required("Password is required")
})