# LegalLink

A secure client–attorney portal that connects people seeking legal help with verified lawyers. Clients can search for attorneys, schedule consultations, and share case documents through an encrypted vault; attorneys get a dashboard to manage cases, review shared files, and track their calendar — all behind a role-based login.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Vite](https://img.shields.io/badge/Vite-6-646CFF) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)

## Features

- **Role-based authentication** — sign in as a Client or an Attorney; the app adapts what you see based on your role
- **Find an Expert** — search and filter verified attorneys by specialty, experience, location, and rating
- **Secure Vault** — upload, organize into collections, and manage sharing permissions on case documents
- **Case tracking** — view active cases with status and progress at a glance
- **Scheduling** — book consultations and case reviews directly with an attorney
- **Notifications** — stay on top of document approvals, access requests, and uploads
- **Attorney profiles** — credentials, prior case outcomes, and client endorsements

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/) for tooling and dev server
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Motion](https://motion.dev/) for animation
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Other scripts

```bash
npm run build    # Production build to /dist
npm run preview  # Preview the production build locally
npm run lint      # Type-check with tsc
npm run clean     # Remove build output
```

## Project Structure

```
src/
├── main.tsx        # Entry point — mounts Root
├── Root.tsx          # Owns auth/session state; switches between LoginPage and App
├── LoginPage.tsx       # Role-based sign in / sign up screen
├── App.tsx              # Main app shell: Home, Find an Expert, Vault, Profile tabs
├── data.ts                # Seed/mock data (attorneys, cases, documents, folders)
├── types.ts                 # Shared TypeScript interfaces
└── index.css                  # Tailwind theme tokens and global styles
```

## How Auth Works

`Root.tsx` holds the session in memory. On successful sign in, `LoginPage` calls `onAuthenticated(role)`, which renders `App` with that role passed in as a prop. `App` exposes a sign-out button in the header that clears the session and returns to `LoginPage`. This is a front-end simulation — wire `LoginPage`'s submit handler up to a real auth API when one is available.

## License

Apache-2.0
