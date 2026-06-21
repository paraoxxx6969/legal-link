/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoginPage, { UserRole } from './LoginPage';
import App from './App';

export default function Root() {
  const [session, setSession] = useState<{ role: UserRole } | null>(null);

  return (
    <div className="relative min-h-screen text-white antialiased overflow-x-hidden">
      {/* Shared site-wide background photo. Lives here (not inside LoginPage/App) so it
          persists untouched across every screen — no flicker or restart on navigation. */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div
          className="site-bg-photo absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
      </div>

      {/* Dark vignette + brand-color glows over the photo, for legibility on every page */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 78% 12%, rgba(79,70,229,0.20) 0%, transparent 55%), radial-gradient(circle at 12% 85%, rgba(139,92,246,0.14) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(2,2,5,0.52) 0%, rgba(2,2,5,0.88) 100%)',
        }}
      />

      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LoginPage onAuthenticated={(role) => setSession({ role })} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <App role={session.role} onLogout={() => setSession(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
