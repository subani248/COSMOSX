export const registerSchema = {
  validate: (data) => {
    const errors = {};
    if (!data.name || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email';
    if (!data.password || data.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return { error: Object.keys(errors).length ? { details: [{ message: Object.values(errors)[0] }] } : null };
  },
};

export const loginSchema = {
  validate: (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    return { error: Object.keys(errors).length ? { details: [{ message: Object.values(errors)[0] }] } : null };
  },
};
