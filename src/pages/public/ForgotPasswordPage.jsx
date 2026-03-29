import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError(null);
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-xl">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
                        <ArrowLeft size={14} />
                        {t('auth.back_to_login')}
                    </Link>

                    {!sent ? (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                                <Mail size={24} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t('auth.reset_title')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('auth.reset_subtitle')}</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/50">
                                        {error}
                                    </div>
                                )}
                                <Input label={t('auth.email')} icon={Mail} type="email" placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Button type="submit" variant="gradient" size="lg" fullWidth loading={loading}>
                                    {t('auth.send_reset')}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Reset Link Sent!</h2>
                            <p className="text-gray-500 dark:text-gray-400">We've sent a password reset link to <strong className="text-gray-700 dark:text-gray-300">{email}</strong>. Please check your inbox.</p>
                            <Link to="/login" className="mt-6 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                                {t('auth.back_to_login')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
