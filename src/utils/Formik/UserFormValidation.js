export const validate = (values) => {
    const errors = {};

    if (!values.firstname) {
        errors.firstname = 'Required';
    } else if (values.firstname.length > 15) {
        errors.firstname = 'Must be 15 characters or less';
    }

    if (!values.lastname) {
        errors.lastname = 'Required';
    } else if (values.lastname.length > 20) {
        errors.lastname = 'Must be 20 characters or less';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length > 20) {
        errors.password = 'Must be 20 characters or less';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};
