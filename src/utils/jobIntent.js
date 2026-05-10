const STORAGE_KEY = 'pendingJobIntent';
const EXPIRY_MS = 1000 * 60 * 60 * 6; // 6 hours

const roleRedirects = {
  student: '/student',
  recruiter: '/recruiter',
  supervisor: '/supervisor',
  admin: '/admin',
};

export const setPendingJobIntent = ({ jobId, action }) => {
  if (!jobId || !action) return;
  const payload = {
    jobId,
    action, // view | apply
    createdAt: Date.now(),
    expiresAt: Date.now() + EXPIRY_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getPendingJobIntent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.jobId || !parsed?.action) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearPendingJobIntent = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const resolvePostAuthRedirect = (role) => {
  const intent = getPendingJobIntent();
  if (intent && role === 'student') {
    clearPendingJobIntent();
    return {
      path: '/student/browse',
      state:
        intent.action === 'apply'
          ? { openApplyId: intent.jobId }
          : { openViewId: intent.jobId },
    };
  }
  clearPendingJobIntent();
  return { path: roleRedirects[role] || '/', state: undefined };
};
