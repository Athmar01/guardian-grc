# 8-Week GRC Platform Transformation Plan

## Overview
Transform guardian-grc-main into enterprise-grade GRC platform in 8 weeks by implementing critical features from ciso-assistant architecture.

## Week 1-2: Database Migration & Core Schema

### Day 1-3: PostgreSQL Setup with Prisma

```bash
# Install dependencies
cd /Users/xapath/Desktop/GRC Apps/GRC apps/guardian-grc-main/guardian
npm install prisma @prisma/client
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Models
model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  settings  Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  folders   Folder[]
  users     User[]
}

model Folder {
  id             String   @id @default(uuid())
  name           String
  parentId       String?
  parent         Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children       Folder[] @relation("FolderHierarchy")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  path           String   // materialized path
  
  controls       Control[]
  policies       Policy[]
  risks          Risk[]
  assets         Asset[]
  frameworks     Framework[]
  assessments    Assessment[]
  
  @@index([organizationId, path])
}

model Framework {
  id          String   @id @default(uuid())
  urn         String   @unique
  name        String
  version     String
  description String?
  folderId    String
  folder      Folder   @relation(fields: [folderId], references: [id])
  metadata    Json     @default("{}")
  
  requirements     Requirement[]
  referenceControls ReferenceControl[]
  assessments      ComplianceAssessment[]
}

model ReferenceControl {
  id           String   @id @default(uuid())
  ref_id       String
  frameworkId  String
  framework    Framework @relation(fields: [frameworkId], references: [id])
  name         String
  description  String?
  category     String?
  
  appliedControls Control[]
  
  @@unique([frameworkId, ref_id])
}

model Control {
  id              String   @id @default(uuid())
  controlId       String   @unique
  name            String
  description     String?
  family          String?
  status          String   @default("draft")
  effectiveness   Int      @default(0)
  
  folderId        String
  folder          Folder   @relation(fields: [folderId], references: [id])
  
  referenceControlId String?
  referenceControl   ReferenceControl? @relation(fields: [referenceControlId], references: [id])
  
  ownerId         String?
  owner           User?    @relation(fields: [ownerId], references: [id])
  
  metadata        Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  policies        PolicyControl[]
  risks           RiskControl[]
  evidences       Evidence[]
  requirements    RequirementControl[]
}

model Asset {
  id              String   @id @default(uuid())
  name            String
  description     String?
  type            String   // primary, support, physical, software, data
  businessValue   String?
  
  folderId        String
  folder          Folder   @relation(fields: [folderId], references: [id])
  
  // Security objectives
  confidentiality Int      @default(0)
  integrity       Int      @default(0)
  availability    Int      @default(0)
  
  // Recovery objectives
  rto             Int?     // seconds
  rpo             Int?     // seconds
  
  metadata        Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  risks           RiskAsset[]
  parentAssets    AssetRelation[] @relation("ChildAsset")
  childAssets     AssetRelation[] @relation("ParentAsset")
}

model Risk {
  id           String   @id @default(uuid())
  riskId       String   @unique
  name         String
  description  String?
  category     String?
  status       String   @default("identified")
  
  folderId     String
  folder       Folder   @relation(fields: [folderId], references: [id])
  
  likelihood   Int      @default(0)
  impact       Int      @default(0)
  inherentRisk Int      @default(0)
  residualRisk Int      @default(0)
  
  treatment    String?  // accept, mitigate, transfer, avoid
  
  metadata     Json     @default("{}")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  controls     RiskControl[]
  assets       RiskAsset[]
  scenarios    RiskScenario[]
}

model Assessment {
  id          String   @id @default(uuid())
  name        String
  type        String   // compliance, risk
  status      String   @default("planned")
  version     String   @default("1.0")
  
  folderId    String
  folder      Folder   @relation(fields: [folderId], references: [id])
  
  startDate   DateTime?
  endDate     DateTime?
  
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  complianceAssessment ComplianceAssessment?
  riskAssessment      RiskAssessment?
}

model ComplianceAssessment {
  id           String   @id @default(uuid())
  assessmentId String   @unique
  assessment   Assessment @relation(fields: [assessmentId], references: [id])
  
  frameworkId  String
  framework    Framework @relation(fields: [frameworkId], references: [id])
  
  minScore     Int      @default(0)
  maxScore     Int      @default(100)
  
  requirements RequirementAssessment[]
}

model RiskAssessment {
  id           String   @id @default(uuid())
  assessmentId String   @unique
  assessment   Assessment @relation(fields: [assessmentId], references: [id])
  
  matrixId     String
  matrix       RiskMatrix @relation(fields: [matrixId], references: [id])
  
  scenarios    RiskScenario[]
}

model RiskMatrix {
  id          String   @id @default(uuid())
  name        String
  description String?
  
  probability Json     // scale definitions
  impact      Json     // scale definitions
  levels      Json     // risk level definitions
  
  assessments RiskAssessment[]
}

model Evidence {
  id           String   @id @default(uuid())
  name         String
  description  String?
  type         String   // document, screenshot, log, report, link
  
  fileName     String?
  fileSize     Int?
  storageUrl   String?
  externalUrl  String?
  
  metadata     Json     @default("{}")
  createdAt    DateTime @default(now())
  
  controls     Control[]
  requirements RequirementAssessment[]
}

// Junction tables
model PolicyControl {
  policyId  String
  policy    Policy   @relation(fields: [policyId], references: [id])
  controlId String
  control   Control  @relation(fields: [controlId], references: [id])
  
  @@id([policyId, controlId])
}

model RiskControl {
  riskId    String
  risk      Risk     @relation(fields: [riskId], references: [id])
  controlId String
  control   Control  @relation(fields: [controlId], references: [id])
  
  @@id([riskId, controlId])
}

model AssetRelation {
  parentId String
  parent   Asset    @relation("ParentAsset", fields: [parentId], references: [id])
  childId  String
  child    Asset    @relation("ChildAsset", fields: [childId], references: [id])
  
  @@id([parentId, childId])
}
```

### Day 4-7: Migration Implementation

**src/lib/prisma.ts:**
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

**src/migration/migrate.ts:**
```typescript
import { prisma } from '@/lib/prisma';
import mongoose from 'mongoose';

export async function migrateDatabase() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Migrate in order
  await migrateOrganizations();
  await migrateFolders();
  await migrateControls();
  await migratePolicies();
  await migrateRisks();
  
  console.log('Migration completed');
}

async function migrateControls() {
  const Control = mongoose.model('Control');
  const controls = await Control.find({}).lean();
  
  for (const control of controls) {
    await prisma.control.create({
      data: {
        id: control._id.toString(),
        controlId: control.controlId,
        name: control.name,
        description: control.description,
        family: control.family,
        status: control.status,
        effectiveness: control.effectiveness || 0,
        folderId: control.folder.toString(),
        ownerId: control.owner?.toString(),
        metadata: {
          mongoId: control._id.toString(),
          migratedAt: new Date()
        },
        createdAt: control.createdAt,
        updatedAt: control.updatedAt
      }
    });
  }
}
```

### Day 8-14: Update API Routes

**src/app/api/controls/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateControlSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  family: z.string().optional(),
  folderId: z.string().uuid(),
  referenceControlId: z.string().uuid().optional()
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  
  const controls = await prisma.control.findMany({
    where: folderId ? { folderId } : undefined,
    include: {
      owner: true,
      referenceControl: true,
      evidences: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json(controls);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = CreateControlSchema.parse(body);
  
  const control = await prisma.control.create({
    data: {
      ...validated,
      controlId: `CTRL-${Date.now()}`
    },
    include: {
      owner: true,
      referenceControl: true
    }
  });
  
  return NextResponse.json(control);
}
```

## Week 3-4: Domain Models & Assessment Engine

### Framework & Reference Control Management

**src/app/api/frameworks/route.ts:**
```typescript
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { framework, controls } = await request.json();
  
  // Create framework with reference controls
  const created = await prisma.framework.create({
    data: {
      ...framework,
      referenceControls: {
        create: controls.map((ctrl: any) => ({
          ref_id: ctrl.ref_id,
          name: ctrl.name,
          description: ctrl.description,
          category: ctrl.category
        }))
      }
    },
    include: {
      referenceControls: true
    }
  });
  
  return NextResponse.json(created);
}
```

### Asset Management Implementation

**src/components/assets/AssetForm.tsx:**
```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const AssetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['primary', 'support', 'physical', 'software', 'data']),
  businessValue: z.string().optional(),
  confidentiality: z.number().min(0).max(5),
  integrity: z.number().min(0).max(5),
  availability: z.number().min(0).max(5),
  rto: z.number().optional(),
  rpo: z.number().optional()
});

export function AssetForm({ folderId, onSuccess }: Props) {
  const form = useForm({
    resolver: zodResolver(AssetSchema),
    defaultValues: {
      confidentiality: 0,
      integrity: 0,
      availability: 0
    }
  });

  const onSubmit = async (data: z.infer<typeof AssetSchema>) => {
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, folderId })
    });
    
    if (response.ok) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Risk Assessment Module

**src/components/risks/RiskMatrix.tsx:**
```typescript
interface RiskMatrixProps {
  likelihood: number;
  impact: number;
  onChange: (likelihood: number, impact: number) => void;
}

export function RiskMatrix({ likelihood, impact, onChange }: RiskMatrixProps) {
  const matrix = [
    [1, 2, 3, 4, 5],
    [2, 4, 6, 8, 10],
    [3, 6, 9, 12, 15],
    [4, 8, 12, 16, 20],
    [5, 10, 15, 20, 25]
  ];

  const getRiskLevel = (score: number) => {
    if (score <= 5) return 'low';
    if (score <= 12) return 'medium';
    if (score <= 20) return 'high';
    return 'critical';
  };

  return (
    <div className="grid grid-cols-6 gap-1">
      {/* Matrix implementation */}
    </div>
  );
}
```

## Week 5-6: Compliance Assessment Engine

### Compliance Assessment Implementation

**src/app/api/assessments/compliance/route.ts:**
```typescript
export async function POST(request: NextRequest) {
  const { frameworkId, folderId, name } = await request.json();
  
  // Create assessment with requirements
  const assessment = await prisma.assessment.create({
    data: {
      name,
      type: 'compliance',
      folderId,
      complianceAssessment: {
        create: {
          frameworkId,
          requirements: {
            create: await generateRequirements(frameworkId)
          }
        }
      }
    },
    include: {
      complianceAssessment: {
        include: {
          framework: true,
          requirements: true
        }
      }
    }
  });
  
  return NextResponse.json(assessment);
}

async function generateRequirements(frameworkId: string) {
  const requirements = await prisma.requirement.findMany({
    where: { frameworkId }
  });
  
  return requirements.map(req => ({
    requirementId: req.id,
    status: 'todo',
    result: 'not_assessed'
  }));
}
```

### Evidence Management

**src/components/evidence/EvidenceUpload.tsx:**
```typescript
import { useDropzone } from 'react-dropzone';

export function EvidenceUpload({ onUpload }: { onUpload: (files: File[]) => void }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (files) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch('/api/evidence/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        onUpload(files);
      }
    }
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-6">
      <input {...getInputProps()} />
      <p>Drop evidence files here or click to select</p>
    </div>
  );
}
```

## Week 7: AI-Ready Features & Integration

### Vector Search Implementation

**src/lib/embeddings.ts:**
```typescript
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  
  return response.data[0].embedding;
}

export async function searchSimilar(query: string, type: string) {
  const embedding = await generateEmbedding(query);
  
  // Use pgvector for similarity search
  const results = await prisma.$queryRaw`
    SELECT id, name, description, 
           1 - (embedding <=> ${embedding}::vector) as similarity
    FROM ${type}s
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${embedding}::vector
    LIMIT 10
  `;
  
  return results;
}
```

### GraphQL API Layer

**src/app/api/graphql/route.ts:**
```typescript
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Control {
    id: ID!
    controlId: String!
    name: String!
    description: String
    status: String!
    effectiveness: Int!
    owner: User
    evidences: [Evidence!]!
  }

  type Query {
    controls(folderId: ID!): [Control!]!
    control(id: ID!): Control
    searchControls(query: String!): [Control!]!
  }

  type Mutation {
    createControl(input: CreateControlInput!): Control!
    updateControl(id: ID!, input: UpdateControlInput!): Control!
  }
`;

const resolvers = {
  Query: {
    controls: async (_: any, { folderId }: any) => {
      return prisma.control.findMany({ where: { folderId } });
    },
    searchControls: async (_: any, { query }: any) => {
      return searchSimilar(query, 'control');
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
```

## Week 8: Testing, Optimization & Deployment

### Performance Optimization

**src/lib/cache.ts:**
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;
  
  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttl });
  
  return fresh;
}
```

### Testing Suite

**tests/integration/api.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('API Integration Tests', () => {
  it('should create and retrieve control', async () => {
    const control = await prisma.control.create({
      data: {
        controlId: 'TEST-001',
        name: 'Test Control',
        folderId: 'test-folder-id'
      }
    });
    
    expect(control.id).toBeDefined();
    
    const retrieved = await prisma.control.findUnique({
      where: { id: control.id }
    });
    
    expect(retrieved?.name).toBe('Test Control');
  });
});
```

### Deployment Configuration

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/guardian
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: guardian
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

## Implementation Checklist

### Week 1-2: Database Migration
- [ ] Set up PostgreSQL and Prisma
- [ ] Create complete schema
- [ ] Implement migration scripts
- [ ] Update all API routes
- [ ] Test data integrity

### Week 3-4: Domain Models
- [ ] Implement Framework management
- [ ] Create Asset module
- [ ] Build Risk assessment
- [ ] Add Evidence handling
- [ ] Create UI components

### Week 5-6: Assessment Engine
- [ ] Build Compliance assessments
- [ ] Implement scoring system
- [ ] Create requirement mapping
- [ ] Add progress tracking
- [ ] Build reporting

### Week 7: AI Features
- [ ] Set up vector embeddings
- [ ] Implement similarity search
- [ ] Create GraphQL API
- [ ] Add caching layer
- [ ] Build AI interfaces

### Week 8: Production Ready
- [ ] Complete test suite
- [ ] Performance optimization
- [ ] Security audit
- [ ] Docker deployment
- [ ] Documentation

## Critical Success Factors

1. **Data Migration**: Zero data loss, maintain all relationships
2. **Performance**: <50ms API response time
3. **Features**: All core GRC functionality operational
4. **Testing**: >80% code coverage
5. **Deployment**: One-command deployment process

## Next Steps After Week 8

1. User acceptance testing
2. Performance tuning based on real usage
3. Additional AI features
4. Advanced analytics dashboard
5. Mobile app development
