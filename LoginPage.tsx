/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gavel,
  Shield,
  Eye,
  EyeOff,
  Briefcase,
  User,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';

export type UserRole = 'client' | 'lawyer';

interface LoginPageProps {
  /** Called once the (simulated) auth request succeeds. The parent decides what happens next — i.e. showing Home. */
  onAuthenticated: (role: UserRole) => void;
}

interface RoleConfigEntry {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
}

const ROLE_CONFIG: Record<UserRole, RoleConfigEntry> = {
  client: {
    label: 'Client',
    subtitle: 'Find & manage legal counsel',
    icon: <User className="w-7 h-7" />,
    features: ['Browse verified attorneys', 'Manage case documents', 'Schedule consultations'],
  },
  lawyer: {
    label: 'Attorney',
    subtitle: 'Manage your legal practice',
    icon: <Briefcase className="w-7 h-7" />,
    features: ['View client cases', 'Access secure vault', 'Manage your calendar'],
  },
};

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Select whether you are a client or an attorney to continue.');
      return;
    }
    setError(null);
    setIsLoading(true);

    // Simulated auth round-trip — swap this for a real API call when one exists.
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(role);
    }, 900);
  };

  return (
    <div className="relative min-h-screen text-white antialiased flex flex-col items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-9"
        >
          <div className="float-slow inline-flex items-center justify-center w-[52px] h-[52px] rounded-2xl bg-[#4f46e5] mb-4 pill-glow">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight text-white m-0">
            LEGAL<span className="text-indigo-400 font-light">LINK</span>
          </h1>
          <p className="text-xs text-white/50 tracking-wide mt-1">Secure counsel portal</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-[28px] p-7 md:p-8"
        >
          {/* Mode toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-7">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                  mode === m ? 'bg-[#4f46e5] text-white pill-glow' : 'text-white/45 hover:text-white/70'
                }`}
                id={m === 'login' ? 'mode-toggle-login' : 'mode-toggle-signup'}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2.5">I am a</p>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.entries(ROLE_CONFIG) as [UserRole, RoleConfigEntry][]).map(([key, cfg]) => {
                const isSelected = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`relative text-center p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-400/60 bg-indigo-500/15 shadow-[0_0_24px_rgba(79,70,229,0.25)]'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                    id={`role-select-${key}`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-[#4f46e5] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <div className={`mb-2 flex justify-center ${isSelected ? 'text-indigo-400' : 'text-white/40'}`}>
                      {cfg.icon}
                    </div>
                    <div className={`text-[13px] font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-white/65'}`}>
                      {cfg.label}
                    </div>
                    <div className="text-[10px] text-white/35 leading-tight">{cfg.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role feature pills */}
          <AnimatePresence mode="wait">
            {role && (
              <motion.div
                key={role}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-5 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex gap-2 flex-wrap">
                  {ROLE_CONFIG[role].features.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-1"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" id="login-form">
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'lawyer' ? 'e.g. Sarah Jenkins, Esq.' : 'e.g. Alex Morgan'}
                  required
                  className="w-full h-[46px] bg-white/5 border border-white/10 rounded-2xl px-4 text-[13px] text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-white/25"
                  id="signup-fullname"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-[46px] bg-white/5 border border-white/10 rounded-2xl px-4 text-[13px] text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-white/25"
                id="login-email"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                    id="forgot-password-btn"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={8}
                  className="w-full h-[46px] bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 text-[13px] text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-white/25"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 cursor-pointer"
                  id="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    rememberMe ? 'bg-[#4f46e5] border-[#4f46e5]' : 'border-white/20 bg-transparent'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-xs text-white/55 font-medium">Keep me signed in for 30 days</span>
              </label>
            )}

            {error && (
              <p className="text-[11px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-[50px] mt-1.5 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                role
                  ? 'bg-[#4f46e5] hover:bg-indigo-650 text-white pill-glow border border-indigo-400/30'
                  : 'bg-white/[0.08] text-white/35 border border-white/10'
              } disabled:cursor-not-allowed`}
              id="submit-auth-btn"
            >
              {isLoading ? (
                <span className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In Securely' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <Shield className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
            256-bit AES encrypted · SOC 2 Type II
          </span>
          <Lock className="w-3.5 h-3.5 text-white/40" />
        </motion.div>
      </div>
    </div>
  );
}
