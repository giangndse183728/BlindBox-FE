import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .required('Required'),
});

export const signupSchema = Yup.object({
    username: Yup.string()
        .min(1, 'Username must be at least 1 character')
        .max(50, 'Username must be at most 50 characters')
        .matches(
            /^[a-zA-Z0-9]+$/,
            'Username can only contain letters and numbers '
        )
        .required('Required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be at most 50 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
            'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
        )
        .required('Required'),
    'confirm-password': Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number is invalid')
        .min(10, 'Phone number length must be from 10 to 15')
        .max(15, 'Phone number length must be from 10 to 15')
        .required('Required'),
});

export const tradingPostSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title cannot exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .max(500, 'Description cannot exceed 500 characters'),
    image: Yup.string()
        .required('Image is required'),
});

export const profileSchema = Yup.object({

    fullName: Yup.string()
        .max(100, 'Full name cannot exceed 100 characters'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number is invalid')
        .min(10, 'Phone number length must be from 10 to 15')
        .max(15, 'Phone number length must be from 10 to 15'),
    address: Yup.string()
        .max(100, 'Address cannot exceed 100 characters'),
    biography: Yup.string()
        .max(500, 'Biography cannot exceed 500 characters')
});

export const validationSchemas = {
    login: loginSchema,
    sign: signupSchema,
    tradingPost: tradingPostSchema,
    profile: profileSchema,
};

export default validationSchemas;