import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Star,
  Users,
  User,
  Target,
  Briefcase,
  Award,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Quote,
  BarChart3,
  TrendingUp,
  Zap,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown";
import { toggleTheme } from "../../features/theme/themeSlice";
import { setLanguage } from "../../features/language/languageSlice";

const SUCCESS_STATS = [
  { label: "Placements", value: "1,200+", icon: Users, color: "text-blue-600" },
  {
    label: "Companies",
    value: "450+",
    icon: Briefcase,
    color: "text-violet-600",
  },
  { label: "Avg. Rating", value: "4.9/5", icon: Star, color: "text-amber-500" },
  {
    label: "User Earnings",
    value: "$250k+",
    icon: TrendingUp,
    color: "text-emerald-600",
  },
];

export default function SuccessStoriesPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { lang } = useSelector((state) => state.language);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));
  };

  return (
    <div
      className={`min-h-screen ${mode === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"} font-sans transition-colors duration-300`}
    >
      {/* Navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10">
        <nav
          className={`max-w-7xl mx-auto transition-all duration-300 ${mode === "dark" ? "bg-slate-900/85" : "bg-white/85"} backdrop-blur-md border ${mode === "dark" ? "border-slate-700/60" : "border-slate-200/80"} rounded-2xl shadow-lg shadow-black/10`}
        >
          <div className="px-5 sm:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <span className="font-extrabold text-white text-lg">F</span>
                </div>
                <span
                  className={`font-extrabold text-xl tracking-tight ${mode === "dark" ? "text-white" : "text-slate-800"}`}
                >
                  Frelaunch.
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8 font-medium">
                <Link
                  to="/#how-it-works"
                  className={`hover:text-blue-500 transition-colors text-sm ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}
                >
                  How It Works
                </Link>
                <Link
                  to="/#features"
                  className={`hover:text-blue-500 transition-colors text-sm ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}
                >
                  Features
                </Link>
                <Link
                  to="/success-stories"
                  className="text-blue-600 dark:text-blue-400 text-sm font-bold border-b-2 border-blue-600"
                >
                  Success Stories
                </Link>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Dropdown
                  align="right"
                  trigger={
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full px-3 py-1.5 transition-colors cursor-pointer">
                      <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">
                        {lang}
                      </span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  }
                >
                  {[
                    { code: "en", label: "English" },
                    { code: "am", label: "አማርኛ" },
                    { code: "or", label: "Afaan Oromo" },
                  ].map((l) => (
                    <DropdownItem
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{l.label}</span>
                        {lang === l.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </DropdownItem>
                  ))}
                </Dropdown>

                <button
                  onClick={handleToggleTheme}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {mode === "light" ? (
                    <Moon className="w-5 h-5 text-slate-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/30 whitespace-nowrap flex-shrink-0"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section
        className={`relative pt-60 pb-24 ${mode === "dark" ? "bg-slate-900" : "bg-white"} overflow-hidden`}
      >
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeUp}
                className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full mb-6"
              >
                Impact & Results
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 ${mode === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Real Stories from{" "}
                <span className="gradient-text">Real Talent</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className={`text-lg md:text-xl font-medium mb-10 leading-relaxed ${mode === "dark" ? "text-slate-300" : "text-slate-600"}`}
              >
                Discover how Ethiopian students are launching their careers and
                how companies are finding exceptional talent through our
                platform.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                >
                  Start Your Story <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative mt-8 lg:mt-0"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src="/success_hero_photo.jpg"
                alt="Success Stories"
                className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 object-cover w-full h-[320px] md:h-[400px]"
                onError={(e) => {
                  // Fallback if the photo doesn't load
                  e.target.src =
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800";
                }}
              />
              {/* Floating Card */}
              <div
                className={`absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-xl border ${mode === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} hidden md:block max-w-[240px]`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Award size={20} />
                  </div>
                  <div className="text-sm font-bold">New Placement</div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Aman Gebre just secured a Full Stack role at Safaricom
                  Ethiopia!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Growth Journey Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-sm">
              Your Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
              Built for Your{" "}
              <span className="gradient-text">Professional Growth</span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${mode === "dark" ? "text-slate-400" : "text-slate-600"}`}
            >
              We don't just find you jobs. We provide a structured path to
              transition from a student to a high-demand professional.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                step: "01",
                title: "Identity Building",
                desc: "Create a professional digital presence that highlights your skills, projects, and academic excellence.",
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Smart Discovery",
                desc: "Our AI matches you with opportunities that align perfectly with your career goals and current skill level.",
                icon: Target,
                color: "from-indigo-500 to-violet-500",
              },
              {
                step: "03",
                title: "Skill Mastery",
                desc: "Work on real-world projects with industry veterans to sharpen your technical and soft skills.",
                icon: Zap,
                color: "from-violet-500 to-purple-500",
              },
              {
                step: "04",
                title: "Success Launch",
                desc: "Graduate with a proven track record, a rich portfolio, and direct connections to top hiring companies.",
                icon: Award,
                color: "from-purple-500 to-pink-500",
              },
            ].map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                variants={fadeUp}
                key={i}
                className={`relative p-8 rounded-[32px] border group hover:-translate-y-2 transition-all duration-300 ${mode === "dark" ? "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50" : "bg-white border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl"}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}
                >
                  <Icon size={28} />
                </div>
                <div className="text-5xl font-black opacity-10 mb-2 leading-none">
                  {step}
                </div>
                <h4 className="text-xl font-extrabold mb-3">{title}</h4>
                <p
                  className={`text-sm leading-relaxed ${mode === "dark" ? "text-slate-400" : "text-slate-500"}`}
                >
                  {desc}
                </p>
                <div
                  className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${color} rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Journey Section */}
      <section
        className={`py-24 ${mode === "dark" ? "bg-slate-800" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight">
                How Frelaunch Accelerates <br />
                <span className="text-blue-600">Your Success Journey</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Skills Validation",
                    desc: "Get your skills verified by industry experts and build a profile that managers trust.",
                    icon: CheckCircle2,
                  },
                  {
                    title: "Project Experience",
                    desc: "Work on real freelance projects and internships that add value to your CV.",
                    icon: Zap,
                  },
                  {
                    title: "Earnings & Rewards",
                    desc: "Earn money while you learn and get rewarded for high-quality work.",
                    icon: BarChart3,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p
                        className={`text-sm ${mode === "dark" ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=400"
                  alt="Team"
                  className="rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400"
                  alt="Work"
                  className="rounded-2xl shadow-lg mt-8"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 md:p-24 text-center shadow-[0_30px_60px_rgba(37,99,235,0.25)]"
            style={{ borderRadius: "40px" }}
          >
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#ffffff,_transparent_70%),_radial-gradient(circle_at_bottom_left,_#000000,_transparent_70%)]"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                Ready to build your own <br className="hidden md:block" />
                <span className="text-blue-200">Success Story?</span>
              </h2>
              <p className="text-blue-100/90 text-lg md:text-xl mb-12 font-medium leading-relaxed">
                Join over 5,000 students and 500 companies in Ethiopia's{" "}
                <br className="hidden md:block" />
                fastest-growing digital talent community.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <Link
                  to="/register"
                  className="group w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 rounded-full font-bold text-base shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Now For Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/#features"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white border border-white/30 backdrop-blur-md rounded-full font-bold text-base hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${mode === "dark" ? "bg-slate-950" : "bg-slate-900"} text-white`}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10"
        >
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
          >
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <span className="font-bold text-white text-base">F</span>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Frelaunch.
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                The ultimate platform connecting ambitious Ethiopian students
                with top companies.
              </p>
              <div className="space-y-2 mb-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-400" /> Addis Ababa,
                  Ethiopia
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-blue-400" />{" "}
                  hello@frelaunch.et
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold text-white text-sm mb-5 uppercase">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/student/browse"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recruiter/post"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold text-white text-sm mb-5 uppercase">
                Useful Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/#how-it-works"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/success-stories"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-slate-400 hover:text-blue-400"
                  >
                    Register Now
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold text-white text-sm mb-5 uppercase">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <Twitter
                  size={20}
                  className="text-slate-400 hover:text-blue-400 cursor-pointer"
                />
                <Linkedin
                  size={20}
                  className="text-slate-400 hover:text-blue-400 cursor-pointer"
                />
                <Github
                  size={20}
                  className="text-slate-400 hover:text-blue-400 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Frelaunch Inc. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-blue-400">
                Privacy
              </Link>
              <Link to="#" className="hover:text-blue-400">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
