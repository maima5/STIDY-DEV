export const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
export const isValidPassword = (v: string) => v.length >= 8;