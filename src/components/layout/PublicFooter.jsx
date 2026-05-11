import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicFooter() {
    const { t } = useTranslation();
    const { mode } = useSelector((state) => state.theme);

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <footer className={`${mode === 'dark' ? 'bg-slate-950' : 'bg-slate-900'} text-white mt-auto`}>
            {/* Main Footer Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Brand Column */}
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                <span className="font-bold text-white text-base">F</span>
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white">Frelaunch.</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                            {t('footer.tagline')}
                        </p>
                        {/* Contact Info */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                                <span>{t('footer.location')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Mail size={14} className="text-blue-400 flex-shrink-0" />
                                <span>hello@frelaunch.et</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Phone size={14} className="text-blue-400 flex-shrink-0" />
                                <span>+251 91 234 5678</span>
                            </div>
                        </div>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Twitter, href: '#' },
                                { Icon: Linkedin, href: '#' },
                                { Icon: Github, href: '#' },
                                { Icon: Instagram, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                                    <Icon size={16} className="text-slate-400 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Platform Links */}
                    <motion.div variants={fadeUp}>
                        <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">{t('footer.links_platform')}</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Browse Jobs', to: '/explore-jobs' },
                                { label: 'Post a Job', to: '/register' },
                                { label: 'How It Works', to: '/#how-it-works' },
                            ].map(({ label, to }) => (
                                <li key={label}>
                                    {to.startsWith('/#') ? (
                                        <a href={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</a>
                                    ) : (
                                        <Link to={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div variants={fadeUp}>
                        <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">{t('footer.links_company')}</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/success-stories" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Success Stories</Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Register Now</Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Login</Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Vision/Mission Section */}
                    <motion.div variants={fadeUp}>
                        <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-wider">{t('footer.vision_title')}</h4>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            {t('footer.vision_desc')}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {t('footer.community_invite')}
                        </p>
                    </motion.div>

                </div>
            </motion.div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        &copy; 2026 Frelaunch Inc. {t('footer.rights')}
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.privacy')}</Link>
                        <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.terms')}</Link>
                        <Link to="#" className="hover:text-blue-400 transition-colors">{t('footer.contact')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
