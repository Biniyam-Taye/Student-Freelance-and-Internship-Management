const REQUIRED_STUDENT_PROFILE_FIELDS = [
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

const getMissingStudentProfileFields = (user = {}) =>
    REQUIRED_STUDENT_PROFILE_FIELDS.filter((field) => !isFilled(user[field]));

const isStudentProfileComplete = (user = {}) => getMissingStudentProfileFields(user).length === 0;

module.exports = {
    REQUIRED_STUDENT_PROFILE_FIELDS,
    getMissingStudentProfileFields,
    isStudentProfileComplete,
};
