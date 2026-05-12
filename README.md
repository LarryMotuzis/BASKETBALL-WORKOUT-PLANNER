# Basketball Workout Planner

A full-stack web app for coaches to plan workouts, manage player rosters, and track development over time.

**Live demo → [basketball-workout-planner.vercel.app](https://basketball-workout-planner.vercel.app)**

---

## Features

**Auth**
- Email / password sign-up and sign-in
- Per-user data isolation — every coach sees only their own roster, drills, and workouts
- Route protection via Next.js proxy middleware

**Players**
- Add and manage a player roster with name and position
- Inline editing directly on the roster list
- Player profile pages with development analytics:
  - Attendance rate with visual progress bar
  - Current week streak
  - Monthly workout frequency chart (last 6 months)
  - Drill category breakdown (donut chart)
  - Top drills by usage with relative frequency bars

**Drills**
- Build a reusable drill library organized by skill category (Shooting, Finishing, Ball Handling, Footwork, Passing, Defense, Conditioning)
- Create, edit, and delete drills with coaching notes

**Workouts**
- Drag-and-drop workout builder — search your drill library, add drills, and reorder them by dragging
- Set duration (minutes) and sets/reps per drill
- Assign multiple players to each workout
- Full edit support — revisit and update any past workout

**Dashboard**
- Live stats scoped to your account (players, workouts, drills, sessions this week)
- Recent activity feed showing the last 4 workouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| Language | TypeScript |
| Auth | [Auth.js v5](https://authjs.dev) (Credentials provider, JWT sessions) |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | [Prisma 6](https://www.prisma.io) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Charts | [Recharts](https://recharts.org) |
| Drag & Drop | [@dnd-kit](https://dndkit.com) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Deployment | [Vercel](https://vercel.com) |

---

## Running Locally

**Prerequisites:** Node.js 18+, a PostgreSQL database (or a free [Neon](https://neon.tech) project)

```bash
# 1. Clone the repo
git clone https://github.com/LarryMotuzis/BASKETBALL-WORKOUT-PLANNER.git
cd BASKETBALL-WORKOUT-PLANNER

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and AUTH_SECRET in .env

# 4. Push the schema and generate the Prisma client
npx prisma migrate deploy
npx prisma generate

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start building workouts.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for signing JWTs — generate with `openssl rand -base64 32` |

---

## Project Structure

```
src/
├── actions/          # Server Actions (auth, players, drills, workouts)
├── app/
│   ├── components/   # Shared UI components (NavLinks, DeleteButton, EditForms…)
│   ├── players/      # Roster list + player profile with analytics
│   ├── drills/       # Drill library
│   ├── workouts/     # Workout list + drag-and-drop builder + edit page
│   ├── sign-in/
│   └── sign-up/
├── auth.ts           # Auth.js configuration
├── proxy.ts          # Route protection middleware
└── lib/
    └── prisma.ts     # Prisma client singleton
prisma/
├── schema.prisma     # Database schema
└── migrations/       # Migration history
```

---

## Database Schema

```
User ──< Player ──< WorkoutPlayer >── Workout
                                         │
User ──< Drill  ──< WorkoutDrill  >──────┘
```

- Each `User` owns their `Player`, `Drill`, and `Workout` records
- `WorkoutPlayer` — many-to-many between workouts and players
- `WorkoutDrill` — ordered join table with optional `duration` and `sets` per drill

---

## Author

**Larry Motuzis** · [GitHub](https://github.com/LarryMotuzis)
