# Quick Start Guide - Zoe Resume Builder

**For developers who already have Node.js, pnpm, and Docker installed.**

---

## 🚀 Quick Setup (5 Minutes)

### 1. Clone & Navigate
```bash
git clone https://github.com/yourusername/zoe-resume-builder.git
cd zoe-resume-builder
```

### 2. Start Backend Services
```bash
docker-compose -f compose.dev.yml up -d
```

Wait ~60 seconds for services to initialize.

### 3. Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Generate AUTH_SECRET
openssl rand -hex 32

# Edit .env and paste the generated key as AUTH_SECRET
```

### 4. Setup Database
```bash
pnpm db:push
```

### 5. Install Dependencies
```bash
pnpm install
```

### 6. Start Development Server
```bash
pnpm dev
```

Open http://localhost:3000 - Done! 🎉

---

## 📝 Daily Workflow

### Morning Start
```bash
# Start backend services
docker-compose -f compose.dev.yml up -d

# Start dev server
pnpm dev
```

### End of Day
```bash
# Stop dev server
# Press Ctrl+C in terminal

# Stop backend services (optional - they can stay running)
docker-compose -f compose.dev.yml down
```

---

## 🔧 Common Commands

### Development
```bash
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm typecheck              # Check TypeScript errors
pnpm lint                   # Format code
```

### Database
```bash
pnpm db:push                # Push schema to database
pnpm db:studio              # Open database GUI
pnpm db:generate            # Generate migrations
pnpm db:migrate             # Run migrations
```

### Docker Services
```bash
# View all services
docker-compose -f compose.dev.yml ps

# Start services
docker-compose -f compose.dev.yml up -d

# Stop services
docker-compose -f compose.dev.yml down

# Restart a specific service
docker-compose -f compose.dev.yml restart postgres

# View logs
docker-compose -f compose.dev.yml logs -f

# Stop logs view
# Press Ctrl+C
```

---

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **App** | http://localhost:3000 | - |
| **Database Admin** | http://localhost:8080 | postgres/postgres |
| **Email Viewer** | http://localhost:8025 | - |
| **Storage Admin** | http://localhost:8333 | - |
| **Database Studio** | http://localhost:4983 | Run: `pnpm db:studio` |

---

## 🐛 Quick Fixes

### Port Already in Use
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Database Connection Error
```bash
docker-compose -f compose.dev.yml restart postgres
# Wait 10 seconds
pnpm dev
```

### Clear Everything & Start Fresh
```bash
# Stop all services
docker-compose -f compose.dev.yml down -v

# Remove dependencies
rm -rf node_modules pnpm-lock.yaml

# Start from scratch
docker-compose -f compose.dev.yml up -d
pnpm install
pnpm db:push
pnpm dev
```

### Dependencies Issue
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📂 Project Structure

```
src/
├── routes/              # Pages (file-based routing)
├── components/          # UI components
├── integrations/        # Backend (database, auth, APIs)
├── schema/              # Data validation
├── hooks/               # React hooks
├── utils/               # Helper functions
└── styles/              # CSS
```

---

## 🎯 First Task Ideas

1. **Change homepage text**
   - Edit: `src/routes/_home/index.tsx`
   - Change "Zoe Resume Builder" to your text

2. **Add a new page**
   - Create: `src/routes/about.tsx`
   - Will be available at `/about`

3. **Customize colors**
   - Edit: `src/styles/globals.css`
   - Modify CSS variables

4. **Add a component**
   - Create: `src/components/my-component.tsx`
   - Import and use in any page

---

## 💡 Pro Tips

- **Hot reload** - Just save files, browser auto-refreshes
- **Type safety** - Fix TypeScript errors in your editor before running
- **Database GUI** - Use `pnpm db:studio` to view/edit data visually
- **Email testing** - All emails go to http://localhost:8025
- **Console logs** - Check terminal where `pnpm dev` is running

---

## 🆘 Need Help?

- **Full Guide:** See `DEVELOPMENT_SETUP.md`
- **Errors:** Check terminal logs where `pnpm dev` is running
- **Docker Logs:** Run `docker-compose -f compose.dev.yml logs -f`

---

**Ready to code!** Open http://localhost:3000 and start building! 🚀
