#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Medical Report Analyzer setup and startup..."

# 1. Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js (v18+) to run this project."
    exit 1
fi

# 2. Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# 3. Generate Prisma client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# 4. Push database schema to MySQL
echo "🗄️ Checking database schema and sync..."
if ! npx prisma db push; then
    echo "⚠️ Warning: Database sync failed. Make sure your MySQL database server is running on 127.0.0.1:3306 and matches the credentials in .env"
    echo "Press Enter to try starting the dev server anyway, or Ctrl+C to abort..."
    read -r
fi

# 5. Start Next.js development server
echo "✨ Launching Next.js development server..."
npm run dev
