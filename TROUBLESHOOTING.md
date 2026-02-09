# Troubleshooting Guide - Zoe Resume Builder

This guide helps you fix common problems you might encounter during development.

---

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Development Server Issues](#development-server-issues)
- [Build Issues](#build-issues)
- [Feature-Specific Issues](#feature-specific-issues)

---

## Installation Issues

### ❌ Problem: Node.js version too old

```
Error: The engine "node" is incompatible with this module.
Expected version ">=20.0.0". Got "18.x.x"
```

**Solution:**
```bash
# Check your version
node --version

# Install Node.js 20 or higher
# macOS (Homebrew)
brew install node@20

# Or use nvm (Node Version Manager)
nvm install 20
nvm use 20
```

---

### ❌ Problem: pnpm not found

```
command not found: pnpm
```

**Solution:**
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

---

### ❌ Problem: pnpm install fails with EACCES

```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Don't use sudo! Fix npm permissions instead:

# Create a directory for global packages
mkdir ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH (add this to ~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.bashrc  # or source ~/.zshrc

# Try again
npm install -g pnpm
```

---

### ❌ Problem: Git clone fails

```
Permission denied (publickey)
fatal: Could not read from remote repository
```

**Solution:**
```bash
# Use HTTPS instead of SSH
git clone https://github.com/yourusername/zoe-resume-builder.git

# Or setup SSH keys:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

---

## Docker Issues

### ❌ Problem: Docker daemon not running

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solution:**
1. **macOS/Windows:** Open Docker Desktop application
2. **Linux:** 
```bash
sudo systemctl start docker
```

---

### ❌ Problem: Port already in use

```
Error: bind: address already in use
```

**Solution:**

**Find and kill process using the port:**

```bash
# PostgreSQL (port 5432)
lsof -ti:5432 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5432   # Windows

# App (port 3000)
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Browserless (port 4000)
lsof -ti:4000 | xargs kill -9  # macOS/Linux

# Adminer (port 8080)
lsof -ti:8080 | xargs kill -9  # macOS/Linux
```

**Or change ports in compose.dev.yml:**
```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Use 5433 instead of 5432
```

---

### ❌ Problem: Services won't start

```
Error: Container xyz is unhealthy
```

**Solution:**
```bash
# Check service status
docker-compose -f compose.dev.yml ps

# View logs for specific service
docker-compose -f compose.dev.yml logs postgres
docker-compose -f compose.dev.yml logs browserless

# Restart specific service
docker-compose -f compose.dev.yml restart postgres

# If still failing, recreate containers
docker-compose -f compose.dev.yml down
docker-compose -f compose.dev.yml up -d --force-recreate
```

---

### ❌ Problem: Docker out of disk space

```
Error: no space left on device
```

**Solution:**
```bash
# Remove unused containers, images, volumes
docker system prune -a --volumes

# WARNING: This removes ALL unused Docker data!
# You'll need to restart services after this
```

---

### ❌ Problem: Can't access Docker services from host

```
Connection refused when accessing http://localhost:8080
```

**Solution:**
```bash
# 1. Check if service is running
docker-compose -f compose.dev.yml ps

# 2. Check if ports are correctly mapped
docker-compose -f compose.dev.yml ps
# Look for the PORTS column

# 3. Make sure you're using localhost, not 127.0.0.1
# Use: http://localhost:8080
# Not: http://127.0.0.1:8080

# 4. On macOS, try host.docker.internal
# In compose.dev.yml, some services need this
```

---

## Database Issues

### ❌ Problem: Connection refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# 1. Check if PostgreSQL is running
docker-compose -f compose.dev.yml ps postgres

# 2. If not running, start it
docker-compose -f compose.dev.yml up -d postgres

# 3. Wait 30 seconds for initialization
sleep 30

# 4. Check logs
docker-compose -f compose.dev.yml logs postgres

# 5. Verify DATABASE_URL in .env
# Should be: postgresql://postgres:postgres@localhost:5432/postgres
```

---

### ❌ Problem: Database authentication failed

```
Error: password authentication failed for user "postgres"
```

**Solution:**
```bash
# Check credentials in compose.dev.yml match .env
# Both should use: postgres/postgres

# In compose.dev.yml:
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=postgres

# In .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# If you changed passwords, recreate database:
docker-compose -f compose.dev.yml down -v
docker-compose -f compose.dev.yml up -d
```

---

### ❌ Problem: Tables don't exist

```
Error: relation "user" does not exist
```

**Solution:**
```bash
# Run migrations
pnpm db:push

# If that fails, try:
pnpm db:generate
pnpm db:migrate

# Or force push
pnpm db:push --force
```

---

### ❌ Problem: Migration fails

```
Error: Cannot push schema, conflicts detected
```

**Solution:**
```bash
# Option 1: Reset database (WARNING: Deletes all data!)
docker-compose -f compose.dev.yml down -v
docker-compose -f compose.dev.yml up -d
sleep 30
pnpm db:push

# Option 2: Generate and apply migration manually
pnpm db:generate
pnpm db:migrate
```

---

### ❌ Problem: Can't access Adminer

```
Browser shows "This site can't be reached"
```

**Solution:**
```bash
# 1. Check if Adminer is running
docker-compose -f compose.dev.yml ps adminer

# 2. Check logs
docker-compose -f compose.dev.yml logs adminer

# 3. Restart Adminer
docker-compose -f compose.dev.yml restart adminer

# 4. Access at http://localhost:8080 (not https!)

# 5. Login with:
# System: PostgreSQL
# Server: postgres
# Username: postgres
# Password: postgres
# Database: postgres
```

---

## Development Server Issues

### ❌ Problem: pnpm dev fails immediately

```
Error: Cannot find module '@tanstack/react-router'
```

**Solution:**
```bash
# Dependencies not installed or corrupted
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

---

### ❌ Problem: Port 3000 already in use

```
Error: Port 3000 is already in use
```

**Solution:**

**Option 1: Kill the process**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Option 2: Use a different port**
```bash
# In .env, change:
APP_URL="http://localhost:3001"

# Then restart dev server
pnpm dev
```

---

### ❌ Problem: Hot reload not working

Files change but browser doesn't update.

**Solution:**
```bash
# 1. Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)

# 2. Restart dev server
# Press Ctrl+C
pnpm dev

# 3. Clear browser cache
# Chrome: DevTools > Network > Disable cache (when DevTools open)

# 4. Check if file is actually saving
# Some editors have issues with auto-save
```

---

### ❌ Problem: White screen / blank page

```
Browser shows empty page or "Application error"
```

**Solution:**
```bash
# 1. Check browser console for errors
# Press F12 > Console tab

# 2. Check terminal for build errors

# 3. Restart dev server
# Ctrl+C, then pnpm dev

# 4. Clear browser cache and hard refresh
# Ctrl+Shift+R

# 5. Check if .env has all required variables
# Compare with .env.example
```

---

### ❌ Problem: TypeScript errors in editor

Red squiggly lines everywhere, but app runs fine.

**Solution:**
```bash
# 1. Restart TypeScript server in VS Code
# Cmd+Shift+P > TypeScript: Restart TS Server

# 2. Regenerate route types
# These are auto-generated
pnpm dev
# Wait for it to generate routeTree.gen.ts

# 3. Check tsconfig.json includes src/
# Should have: "include": ["src/**/*"]

# 4. Reinstall dependencies
rm -rf node_modules
pnpm install
```

---

### ❌ Problem: Environment variables not loaded

Changes to .env don't take effect.

**Solution:**
```bash
# .env changes require restart!
# 1. Stop dev server (Ctrl+C)
# 2. Start again (pnpm dev)

# Note: Some variables are validated at startup
# Check src/utils/env.ts for required variables
```

---

## Build Issues

### ❌ Problem: Build fails with memory error

```
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 pnpm build

# Or add to package.json scripts:
# "build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
```

---

### ❌ Problem: Build succeeds but preview fails

```
pnpm build works, but pnpm preview shows errors
```

**Solution:**
```bash
# 1. Check if .env has production values
# Some variables might be localhost-specific

# 2. Clear build cache
rm -rf .output dist .tanstack

# 3. Rebuild
pnpm build

# 4. Preview
pnpm preview
```

---

### ❌ Problem: Type errors during build

```
Error: TS2345: Type X is not assignable to type Y
```

**Solution:**
```bash
# 1. Run type check to see all errors
pnpm typecheck

# 2. Fix reported errors in your code

# 3. If errors are in node_modules:
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 4. Regenerate route types
rm -rf .tanstack
pnpm dev
# Wait for routeTree.gen.ts to generate
# Then Ctrl+C and build again
```

---

## Feature-Specific Issues

### ❌ Problem: PDF generation not working

Resume won't export to PDF.

**Solution:**
```bash
# 1. Check if Browserless is running
docker-compose -f compose.dev.yml ps browserless

# 2. Check logs
docker-compose -f compose.dev.yml logs browserless

# 3. Verify PRINTER_ENDPOINT in .env
# Should be: ws://localhost:4000?token=1234567890

# 4. Check PRINTER_APP_URL
# Should be: http://host.docker.internal:3000

# 5. Restart Browserless
docker-compose -f compose.dev.yml restart browserless
```

---

### ❌ Problem: File upload fails

Can't upload profile pictures or images.

**Solution:**
```bash
# 1. Check SeaweedFS is running
docker-compose -f compose.dev.yml ps seaweedfs

# 2. Check S3 configuration in .env
S3_ENDPOINT="http://localhost:8333"
S3_BUCKET="reactive-resume"
S3_ACCESS_KEY_ID="seaweedfs"
S3_SECRET_ACCESS_KEY="seaweedfs"

# 3. Recreate bucket
docker-compose -f compose.dev.yml up seaweedfs_create_bucket

# 4. Check file size limit
# Default is 5MB, check src/integrations/orpc/router/storage.ts
```

---

### ❌ Problem: Emails not sending

User registration or password reset emails don't arrive.

**Solution:**
```bash
# In development, emails go to Mailpit, not real addresses!

# 1. Check Mailpit is running
docker-compose -f compose.dev.yml ps mailpit

# 2. Access Mailpit UI
# Open http://localhost:8025

# 3. Check SMTP settings in .env
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_FROM="Zoe Resume Builder <noreply@zoeresume.com>"

# 4. Check terminal logs for email errors
# Look for "Email sent" or error messages
```

---

### ❌ Problem: Authentication fails

Can't login or register.

**Solution:**
```bash
# 1. Check AUTH_SECRET is set in .env
# Generate one: openssl rand -hex 32

# 2. Check database has session table
# Open Adminer at http://localhost:8080

# 3. Check browser cookies
# Clear cookies for localhost:3000

# 4. Check browser console for errors
# Press F12 > Console

# 5. Verify Better Auth is configured
# Check src/integrations/auth/index.ts
```

---

### ❌ Problem: Social login (Google/GitHub) not working

OAuth providers show errors.

**Solution:**
```bash
# 1. Check credentials in .env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# 2. Verify callback URLs in provider settings
# Google: http://localhost:3000/auth/callback/google
# GitHub: http://localhost:3000/auth/callback/github

# 3. Make sure provider is enabled in cloud console

# 4. Check browser console for specific errors

# 5. Restart dev server after changing .env
```

---

### ❌ Problem: Resume data not saving

Changes to resume don't persist.

**Solution:**
```bash
# 1. Check browser console for save errors

# 2. Check network tab
# Press F12 > Network
# Look for failed API calls (red)

# 3. Check database connection
# Verify PostgreSQL is running

# 4. Check authentication
# Make sure you're logged in
# Check session in browser DevTools > Application > Cookies

# 5. Check resume permissions
# Verify user owns the resume
# Check database: SELECT * FROM resume WHERE user_id = '...';
```

---

## General Debugging Tips

### Enable Verbose Logging

```bash
# In .env, add:
NODE_ENV=development
DEBUG=*

# Restart dev server
pnpm dev
```

### Check All Services Status

```bash
# View all running containers
docker-compose -f compose.dev.yml ps

# All should show "Up" status
# If any show "Exit" or "Restarting", check logs
```

### View All Logs

```bash
# Follow all service logs
docker-compose -f compose.dev.yml logs -f

# View specific service
docker-compose -f compose.dev.yml logs -f postgres

# View last 100 lines
docker-compose -f compose.dev.yml logs --tail=100
```

### Clear Everything and Start Fresh

**⚠️ WARNING: This deletes ALL data!**

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Stop and remove all Docker containers/volumes
docker-compose -f compose.dev.yml down -v

# 3. Remove dependencies
rm -rf node_modules pnpm-lock.yaml

# 4. Remove build artifacts
rm -rf .output dist .tanstack

# 5. Start from scratch
docker-compose -f compose.dev.yml up -d
pnpm install
pnpm db:push
pnpm dev
```

### Verify System Requirements

```bash
# Check versions
node --version      # Should be 20.x or higher
pnpm --version      # Should be 10.28.2 or higher
docker --version    # Should be 20.x or higher
git --version       # Any recent version

# Check disk space
df -h              # macOS/Linux
# Should have at least 10GB free

# Check if ports are available
lsof -ti:3000      # Should return nothing
lsof -ti:4000      # Should return nothing
lsof -ti:5432      # Should return nothing
lsof -ti:8080      # Should return nothing
```

---

## Still Having Issues?

### 1. Search Error Message
Copy the exact error and search on:
- Google
- Stack Overflow
- GitHub Issues

### 2. Check Browser Console
Press F12 > Console tab
Look for red errors

### 3. Check Terminal Logs
Errors appear in terminal where `pnpm dev` is running

### 4. Check Docker Logs
```bash
docker-compose -f compose.dev.yml logs -f
```

### 5. Ask for Help
- Create a GitHub issue
- Include:
  - Full error message
  - What you were trying to do
  - Your OS and versions (node, pnpm, docker)
  - Steps to reproduce

---

## Quick Reference: Reset Commands

```bash
# Reset dev server only
# Ctrl+C, then pnpm dev

# Reset dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reset Docker services (keeps data)
docker-compose -f compose.dev.yml restart

# Reset Docker services (deletes data!)
docker-compose -f compose.dev.yml down -v
docker-compose -f compose.dev.yml up -d

# Reset database only
docker-compose -f compose.dev.yml down -v postgres
docker-compose -f compose.dev.yml up -d postgres
sleep 30
pnpm db:push

# Reset everything (nuclear option!)
docker-compose -f compose.dev.yml down -v
rm -rf node_modules pnpm-lock.yaml .output .tanstack
pnpm install
docker-compose -f compose.dev.yml up -d
sleep 60
pnpm db:push
pnpm dev
```

---

**Remember:** Most issues can be fixed by restarting the dev server or Docker services! 🔄
