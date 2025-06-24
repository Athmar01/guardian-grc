# Immediate Implementation Guide - Start NOW

## Prerequisites

- Node.js 18+ and npm
- Git command-line tools

### Step 0: Clone and install dependencies
```bash
git clone https://github.com/Athmar01/guardian-grc.git
cd guardian-grc/guardian
npm install
```

## Day 1: Database Setup (Today)

### Step 1: Install PostgreSQL
```bash
# Adjust commands for your operating system

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create databases
createdb guardian_grc_dev
createdb guardian_grc_test

# Test connection
psql -d guardian_grc_dev -c "SELECT version();"
```

### Step 2: Install Prisma
```bash
# Install Prisma and dependencies
npm install prisma @prisma/client
npm install -D @types/node

# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env (add DATABASE_URL)
```

### Step 3: Update .env
```bash
# Add to .env file
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/guardian_grc_dev"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/guardian_grc_dev"
```

### Step 4: Create Initial Schema
Replace the contents of `prisma/schema.prisma` with the schema from the 8-week plan.

### Step 5: Run Initial Migration
```bash
# Generate migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio to verify
npx prisma studio
```

### Step 6: Start the development server
```bash
npm run dev
```

## Day 2: Create Core Infrastructure

### Step 1: Create Prisma Client
```bash
# Create lib directory
mkdir -p src/lib

# Create prisma.ts file (copy from plan)
```

### Step 2: Create Migration Scripts
```bash
# Create migration directory
mkdir -p src/migration

# Create migration files:
# - src/migration/migrate.ts
# - src/migration/mappers/controlMapper.ts
# - src/migration/mappers/policyMapper.ts
```

### Step 3: Update package.json Scripts
```json
{
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx src/migration/seed.ts",
    "migrate:mongo": "tsx src/migration/migrate.ts"
  }
}
```

## Day 3: Update API Routes

### Priority Order:
1. **Controls API** - Most used feature
2. **Policies API** - Second priority
3. **Risks API** - Third priority
4. **Assets API** - New feature

### Control API Template:
```typescript
// src/app/api/controls/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });
  
  // Implementation from plan
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });
  
  // Implementation from plan
}
```

## Day 4-5: Update Frontend Components

### Update Control Components First:
1. `src/components/controls/ControlList.tsx`
2. `src/components/controls/ControlForm.tsx`
3. `src/components/controls/ControlModal.tsx`

### Key Changes:
- Replace MongoDB ObjectId with UUID
- Update API calls to new endpoints
- Add new fields (referenceControl, etc.)

## Day 6-7: Run Migration

### Pre-Migration Checklist:
- [ ] Backup MongoDB database
- [ ] Test migration script on sample data
- [ ] Verify all mappers work correctly
- [ ] Set up monitoring for migration

### Run Migration:
```bash
# Run in development first
npm run migrate:mongo

# Monitor progress
# Check data integrity
# Run validation scripts
```

## Week 2: New Features

### Priority Features:
1. **Asset Management** - New capability
2. **Framework Library** - Reference controls
3. **Evidence Management** - Compliance support
4. **Risk Matrix** - Visual risk assessment

## Common Issues & Solutions

### Issue 1: TypeScript Errors
```bash
# Regenerate Prisma types
npx prisma generate

# Clear TypeScript cache
rm -rf .next
npm run dev
```

### Issue 2: Migration Failures
```bash
# Reset database
npx prisma migrate reset

# Apply migrations manually
npx prisma db push
```

### Issue 3: Performance Issues
- Add indexes to frequently queried fields
- Implement pagination early
- Use Prisma's `select` to limit data

## Testing Strategy

### Unit Tests:
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react

# Run tests
npm test
```

### Integration Tests:
- Test each API endpoint
- Verify data relationships
- Check authorization

## Monitoring Progress

### Daily Checklist:
- [ ] Morning: Check migration status
- [ ] Midday: Test new features
- [ ] Evening: Fix bugs, update plan

### Weekly Goals:
- Week 1-2: Database migration complete
- Week 3-4: Core features working
- Week 5-6: Assessment engine ready
- Week 7: AI features integrated
- Week 8: Production deployment

## Emergency Rollback Plan

If critical issues arise:
1. Stop all write operations
2. Export PostgreSQL data
3. Restore MongoDB from backup
4. Revert code to previous commit
5. Document issues for resolution

## Support Resources

### Documentation:
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Quick Commands:
```bash
# View database schema
npx prisma studio

# Check migration status
npx prisma migrate status

# Generate ERD diagram
npx prisma generate --generator erd
```

## START NOW!

1. Open terminal
2. Navigate to project folder:
   ```bash
   cd guardian-grc/guardian
   ```
3. Install PostgreSQL and follow Day 1 steps

The clock is ticking - 8 weeks to transform this platform!
