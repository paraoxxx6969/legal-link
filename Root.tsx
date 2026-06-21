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
  );
}
