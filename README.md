# Hacked Game

A cybersecurity-themed interactive game built with Next.js. Test your hacking skills and learn about cybersecurity in a fun, gamified environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18.18.0 or higher** (required for Next.js 15+)
- **npm 8.0.0 or higher** (comes with Node.js)

### Checking Your Node.js Version

```bash
node --version
npm --version
```

If you're running Node.js v12 or older, you'll need to upgrade. We recommend using [nvm](https://github.com/nvm-sh/nvm) for easy Node.js version management:

```bash
# Install Node.js 18 (LTS)
nvm install 18
nvm use 18
```

## Getting Started

1. **Clone the repository** (if not already done):
```bash
git clone <your-repo-url>
cd hacked_game
```

2. **Install dependencies**:
```bash
npm install
```

If you encounter engine warnings or errors, make sure you're using Node.js 18+ and try:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Run the development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000) to see the game.

## Project Structure

This is a Next.js project using the App Router. Key files and directories:

- `app/page.tsx` - Main game page
- `app/layout.tsx` - Root layout component
- `public/` - Static assets
- `components/` - Reusable React components (if any)

## Database Setup

This project uses Prisma with SQLite for data storage. Follow these steps to set up the database:

1. **Create environment file**:
```bash
# Create .env.local file in project root
echo 'DATABASE_URL="file:./dev.db"' > .env.local
```

2. **Initialize the database**:
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Optional: Seed with initial data
npx prisma db seed
```

3. **Restart the development server**:
```bash
npm run dev
```

## How to Use the App

Once your development server is running and the database is set up:

1. **Access the game** at [http://localhost:3000](http://localhost:3000)

2. **Game Features**:
   - Interactive cybersecurity challenges
   - Leaderboard system to track scores
   - Real-time game status updates
   - Progressive difficulty levels

3. **API Endpoints**:
   - `/api/leaderboard` - View top players and scores
   - `/api/game-status` - Check current game state
   - Additional endpoints for game mechanics

4. **Database Management**:
   - View your data: `npx prisma studio` (opens database GUI at http://localhost:5555)
   - Reset database: `npx prisma db push --force-reset`

## Development

You can start editing the game by modifying `app/page.tsx`. The page auto-updates as you edit the file thanks to Next.js hot reloading.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a modern font family for optimal readability.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (if configured)
- **Prisma** - Database ORM (if using database features)

## Troubleshooting

### "next: not found" Error
This usually means you're using an incompatible Node.js version. Ensure you're using Node.js 18.18.0 or higher.

### Engine Warnings
The EBADENGINE warnings indicate version incompatibilities. Upgrade Node.js to resolve these issues.

### Installation Failures
If npm install fails:
1. Check your Node.js version: `node --version`
2. Clear cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules package-lock.json`
4. Reinstall: `npm install`

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [React Documentation](https://react.dev) - Learn React concepts

You can also check out [the Next.js GitHub repository](https://github.com/vercel/next.js) for community support and contributions.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deployment options.

## License

[Add your license information here]