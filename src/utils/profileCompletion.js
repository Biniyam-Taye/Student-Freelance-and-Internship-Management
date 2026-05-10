export const REQUIRED_STUDENT_PROFILE_FIELDS = [
  'name',
  'email',
  'phone',
  'location',
  'bio',
  'university',
  'major',
  'position',
  'skills',
  'cv',
];

const isFilled = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
};

export const getMissingStudentProfileFields = (user = {}) =>
  REQUIRED_STUDENT_PROFILE_FIELDS.filter((field) => !isFilled(user[field]));

export const isStudentProfileComplete = (user = {}) =>
  getMissingStudentProfileFields(user).length === 0;

export const INCOMPLETE_PROFILE_APPLY_MESSAGE =
  'You cannot apply yet. You must fully complete your profile in your Profile Settings before applying.';
