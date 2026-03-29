import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const { resettoken } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(resettoken, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-xl">
                    {!success ? (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                                <Lock size={24} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Reset Password</h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your new password below to reset it.</p>
                            
                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Input
                                        label="New Password"
                                        icon={Lock}
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        rightIcon={() => (
                                            <button type="button" onClick={() => setShowPass(!showPass)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 relative z-10 w-8 h-8 flex items-center justify-center">
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        )}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        label="Confirm Password"
                                        icon={Lock}
                                        type={showConfirmPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        rightIcon={() => (
                                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 relative z-10 w-8 h-8 flex items-center justify-center">
                                                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        )}
                                    />
                                </div>
                                <Button type="submit" variant="gradient" size="lg" fullWidth loading={loading}>
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Password Reset!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Your password has been reset successfully. You will be redirected to the login page shortly.</p>
                            <Link to="/login" className="inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
