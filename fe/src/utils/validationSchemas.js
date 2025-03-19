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

export const blindboxSchema = Yup.object({
    name: Yup.string()
      .required('Product name is required')
      .min(10, 'Name must be from 10 to 255 characters')
      .max(255, 'Name must be from 10 to 255 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be from 10 to 255 characters')
      .max(255, 'Description must be from 10 to 255 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number')
      .typeError('Price must be a number'),
    brand: Yup.string()
      .required('Brand is required')
      .min(1, 'Brand must be from 1 to 100 characters')
      .max(100, 'Brand must be from 1 to 100 characters'),
    size: Yup.number()
      .required('Size is required')
      .positive('Size must be a positive number')
      .typeError('Size must be a number'),
    quantity: Yup.number()
      .required('Quantity is required')
      .integer('Quantity must be a positive integer')
      .positive('Quantity must be a positive integer')
      .typeError('Quantity must be a number')
  });

export const validationSchemas = {
    login: loginSchema,
    sign: signupSchema,
    tradingPost: tradingPostSchema,
    profile: profileSchema,
    blindbox: blindboxSchema,
};

export default validationSchemas;