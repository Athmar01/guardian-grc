# Phase 1: Database Architecture Enhancement - Detailed Implementation Plan

## Overview
Transform guardian-grc-main from MongoDB to PostgreSQL with Prisma ORM, establishing a robust relational database foundation for the enhanced GRC platform.

## Week 1: Environment Setup & Planning

### Day 1-2: Development Environment Setup
```bash
# Install PostgreSQL locally
brew install postgresql@15
brew services start postgresql@15

# Create development database
createdb guardian_grc_dev
createdb guardian_grc_test

# Install Prisma and dependencies
npm install prisma @prisma/client
npm install -D @types/node typescript ts-node
```

### Day 3-4: Initial Prisma Configuration
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Base model for all entities
model BaseEntity {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  createdBy String?
  updatedBy String?
  isDeleted Boolean  @default(false)
  deletedAt DateTime?
  deletedBy String?
}
```

### Day 5: Migration Strategy Documentation
Create detailed mapping document for MongoDB → PostgreSQL migration

## Week 2: Core Schema Design

### Enhanced Schema Design
```prisma
// Organizations and Multi-tenancy
model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  folders     Folder[]
  users       UserOrganization[]
  
  @@index([slug])
}

model Folder {
  id             String    @id @default(uuid())
  name           String
  description    String?
  parentId       String?
  parent         Folder?   @relation("FolderHierarchy", fields: [parentId], references: [id])
  children       Folder[]  @relation("FolderHierarchy")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  path           String    // Materialized path for efficient queries
  level          Int       @default(0)
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // Relations to all GRC entities
  controls       Control[]
  policies       Policy[]
  risks          Risk[]
  assets         Asset[]
  assessments    Assessment[]
  
  @@index([organizationId, path])
  @@index([parentId])
}

// Framework and Reference Data
model Framework {
  id               String    @id @default(uuid())
  urn              String    @unique
  name             String
  version          String?
  description      String?
  category         String?
  implementation_groups Json?
  metadata         Json      @default("{}")
  isActive         Boolean   @default(true)
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  requirements     Requirement[]
  referenceControls ReferenceControl[]
  complianceAssessments ComplianceAssessment[]
  
  @@index([urn])
  @@index([category])
}

model ReferenceControl {
  id            String    @id @default(uuid())
  ref_id        String
  frameworkId   String
  framework     Framework @relation(fields: [frameworkId], references: [id])
  name          String
  description   String?   @db.Text
  category      String?
  function      String?   // NIST CSF Function
  
  metadata      Json      @default("{}")
  translations  Json      @default("{}")
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  appliedControls AppliedControl[]
  requirements    Requirement[]
  
  @@unique([frameworkId, ref_id])
  @@index([category])
  @@index([function])
}

// Core GRC Entities
model Control {
  id              String    @id @default(uuid())
  controlId       String    @unique
  name            String
  description     String?   @db.Text
  family          String?
  category        String?
  
  folderId        String
  folder          Folder    @relation(fields: [folderId], references: [id])
  
  referenceControlId String?
  referenceControl   ReferenceControl? @relation(fields: [referenceControlId], references: [id])
  
  status          ControlStatus @default(DRAFT)
  effectiveness   Int?      @default(0)
  priority        Int?
  
  ownerId         String?
  owner           User?     @relation("ControlOwner", fields: [ownerId], references: [id])
  
  implementationDate DateTime?
  reviewDate      DateTime?
  nextReviewDate  DateTime?
  
  metadata        Json      @default("{}")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  createdBy       String?
  updatedBy       String?
  
  // Relations
  policies        PolicyControl[]
  risks           RiskControl[]
  evidences       Evidence[]
  changeHistory   ChangeLog[]
  
  @@index([folderId])
  @@index([status])
  @@index([family])
}

enum ControlStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  IMPLEMENTED
  DEPRECATED
}

model Asset {
  id                  String    @id @default(uuid())
  name                String
  description         String?   @db.Text
  type                AssetType
  classification      String?
  businessValue       String?
  
  folderId            String
  folder              Folder    @relation(fields: [folderId], references: [id])
  
  ownerId             String?
  owner               User?     @relation("AssetOwner", fields: [ownerId], references: [id])
  
  // Security objectives (CIA triad + extended)
  confidentiality     Int?      @default(0)
  integrity           Int?      @default(0)
  availability        Int?      @default(0)
  authenticity        Int?      @default(0)
  
  // Disaster recovery objectives
  rto                 Int?      // Recovery Time Objective (seconds)
  rpo                 Int?      // Recovery Point Objective (seconds)
  mtd                 Int?      // Maximum Tolerable Downtime (seconds)
  
  metadata            Json      @default("{}")
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  parentAssets        AssetRelation[] @relation("ChildAsset")
  childAssets         AssetRelation[] @relation("ParentAsset")
  risks               RiskAsset[]
  vulnerabilities     VulnerabilityAsset[]
  
  @@index([folderId])
  @@index([type])
}

enum AssetType {
  PRIMARY
  SUPPORT
  PHYSICAL
  SOFTWARE
  DATA
  PERSONNEL
  PROCESS
}

model Risk {
  id              String    @id @default(uuid())
  riskId          String    @unique
  name            String
  description     String?   @db.Text
  category        String?
  
  folderId        String
  folder          Folder    @relation(fields: [folderId], references: [id])
  
  ownerId         String?
  owner           User?     @relation("RiskOwner", fields: [ownerId], references: [id])
  
  status          RiskStatus @default(IDENTIFIED)
  
  // Risk scoring
  likelihood      Int?      @default(0)
  impact          Int?      @default(0)
  inherentRisk    Int?      @default(0)
  residualRisk    Int?      @default(0)
  
  // Treatment
  treatment       RiskTreatment?
  treatmentNotes  String?   @db.Text
  
  identifiedDate  DateTime  @default(now())
  reviewDate      DateTime?
  targetDate      DateTime?
  
  metadata        Json      @default("{}")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  controls        RiskControl[]
  assets          RiskAsset[]
  assessments     RiskScenario[]
  
  @@index([folderId])
  @@index([status])
  @@index([category])
}

enum RiskStatus {
  IDENTIFIED
  ANALYZING
  EVALUATED
  TREATING
  MONITORING
  CLOSED
}

enum RiskTreatment {
  ACCEPT
  MITIGATE
  TRANSFER
  AVOID
}

// Assessment Models
model Assessment {
  id              String    @id @default(uuid())
  name            String
  description     String?   @db.Text
  type            AssessmentType
  version         String    @default("1.0")
  
  folderId        String
  folder          Folder    @relation(fields: [folderId], references: [id])
  
  status          AssessmentStatus @default(PLANNED)
  
  startDate       DateTime?
  endDate         DateTime?
  dueDate         DateTime?
  
  metadata        Json      @default("{}")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Polymorphic relations
  riskAssessment       RiskAssessment?
  complianceAssessment ComplianceAssessment?
  
  @@index([folderId])
  @@index([type])
  @@index([status])
}

enum AssessmentType {
  RISK
  COMPLIANCE
  SECURITY
  PRIVACY
}

enum AssessmentStatus {
  PLANNED
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  ARCHIVED
}

model RiskAssessment {
  id              String    @id @default(uuid())
  assessmentId    String    @unique
  assessment      Assessment @relation(fields: [assessmentId], references: [id])
  
  riskMatrixId    String
  riskMatrix      RiskMatrix @relation(fields: [riskMatrixId], references: [id])
  
  scope           String?   @db.Text
  objectives      String?   @db.Text
  
  // Relations
  scenarios       RiskScenario[]
  
  @@index([riskMatrixId])
}

model ComplianceAssessment {
  id              String    @id @default(uuid())
  assessmentId    String    @unique
  assessment      Assessment @relation(fields: [assessmentId], references: [id])
  
  frameworkId     String
  framework       Framework @relation(fields: [frameworkId], references: [id])
  
  scope           String?   @db.Text
  
  // Scoring configuration
  minScore        Int       @default(0)
  maxScore        Int       @default(100)
  scoringMethod   Json?
  
  // Relations
  requirements    RequirementAssessment[] 
  
  @@index([frameworkId])
}

// Evidence Management
model Evidence {
  id              String    @id @default(uuid())
  name            String
  description     String?   @db.Text
  type            EvidenceType
  
  // File information
  fileName        String?
  fileSize        Int?
  mimeType        String?
  storageUrl      String?   // S3 or local storage URL
  checksum        String?   // SHA-256 hash
  
  // External link
  externalUrl     String?
  
  collectedDate   DateTime  @default(now())
  expiryDate      DateTime?
  
  metadata        Json      @default("{}")
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  createdBy       String?
  
  // Relations
  controls        Control[]
  requirements    RequirementAssessment[]
  
  @@index([type])
  @@index([collectedDate])
}

enum EvidenceType {
  DOCUMENT
  SCREENSHOT
  LOG
  REPORT
  EXTERNAL_LINK
  OTHER
}

// Audit and Change Tracking
model AuditLog {
  id              String    @id @default(uuid())
  userId          String
  userEmail       String
  action          String
  entityType      String
  entityId        String
  changes         Json?     // JSON diff of changes
  ipAddress       String?
  userAgent       String?
  
  timestamp       DateTime  @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([timestamp])
}

model ChangeLog {
  id              String    @id @default(uuid())
  entityType      String
  entityId        String
  fieldName       String
  oldValue        String?   @db.Text
  newValue        String?   @db.Text
  changedBy       String
  changedAt       DateTime  @default(now())
  reason          String?
  
  // Polymorphic relation
  control         Control?  @relation(fields: [entityId], references: [id])
  
  @@index([entityType, entityId])
  @@index([changedAt])
}

// Junction Tables
model PolicyControl {
  policyId        String
  policy          Policy    @relation(fields: [policyId], references: [id])
  controlId       String
  control         Control   @relation(fields: [controlId], references: [id])
  
  @@id([policyId, controlId])
}

model RiskControl {
  riskId          String
  risk            Risk      @relation(fields: [riskId], references: [id])
  controlId       String
  control         Control   @relation(fields: [controlId], references: [id])
  effectiveness   Int?      @default(0)
  
  @@id([riskId, controlId])
}

model AssetRelation {
  parentId        String
  parent          Asset     @relation("ParentAsset", fields: [parentId], references: [id])
  childId         String
  child           Asset     @relation("ChildAsset", fields: [childId], references: [id])
  
  @@id([parentId, childId])
}
```

## Week 3: Migration Implementation

### MongoDB to PostgreSQL Data Mapping

```typescript
// src/migration/mappers/controlMapper.ts
import { Control as MongoControl } from '@/models/Control';
import { Prisma } from '@prisma/client';

export class ControlMapper {
  static toPrisma(mongoControl: MongoControl): Prisma.ControlCreateInput {
    return {
      id: mongoControl._id.toString(),
      controlId: mongoControl.controlId,
      name: mongoControl.name,
      description: mongoControl.description,
      family: mongoControl.family,
      status: this.mapStatus(mongoControl.status),
      effectiveness: mongoControl.effectiveness,
      folder: {
        connect: { id: mongoControl.folder.toString() }
      },
      owner: mongoControl.owner ? {
        connect: { id: mongoControl.owner.toString() }
      } : undefined,
      metadata: {
        mongoId: mongoControl._id.toString(),
        migratedAt: new Date().toISOString(),
        originalData: mongoControl
      },
      createdAt: mongoControl.createdAt,
      updatedAt: mongoControl.updatedAt
    };
  }

  private static mapStatus(mongoStatus: string): ControlStatus {
    const statusMap: Record<string, ControlStatus> = {
      'draft': 'DRAFT',
      'in-review': 'IN_REVIEW',
      'approved': 'APPROVED',
      'implemented': 'IMPLEMENTED',
      'deprecated': 'DEPRECATED'
    };
    return statusMap[mongoStatus] || 'DRAFT';
  }
}
```

### Migration Script

```typescript
// src/migration/migrate.ts
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import { ControlMapper } from './mappers/controlMapper';

export class DatabaseMigration {
  private prisma: PrismaClient;
  private mongo: MongoClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.mongo = new MongoClient(process.env.MONGODB_URI!);
  }

  async migrate() {
    try {
      await this.mongo.connect();
      const db = this.mongo.db('guardian-grc');

      // 1. Migrate Organizations and Folders
      await this.migrateOrganizations(db);
      await this.migrateFolders(db);

      // 2. Migrate Reference Data
      await this.migrateFrameworks(db);
      await this.migrateReferenceControls(db);

      // 3. Migrate Core Entities
      await this.migrateControls(db);
      await this.migratePolicies(db);
      await this.migrateRisks(db);
      await this.migrateAssets(db);

      // 4. Migrate Assessments
      await this.migrateAssessments(db);

      // 5. Migrate Relations
      await this.migrateRelations(db);

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      await this.mongo.close();
      await this.prisma.$disconnect();
    }
  }

  private async migrateControls(db: Db) {
    const controls = await db.collection('controls').find({}).toArray();
    
    for (const control of controls) {
      try {
        const prismaControl = ControlMapper.toPrisma(control);
        await this.prisma.control.create({ data: prismaControl });
      } catch (error) {
        console.error(`Failed to migrate control ${control._id}:`, error);
      }
    }
  }

  // Additional migration methods...
}
```

## Week 4: Testing & Validation

### Data Validation Script

```typescript
// src/migration/validate.ts
export class MigrationValidator {
  async validateMigration() {
    const results = {
      controls: await this.validateControls(),
      policies: await this.validatePolicies(),
      risks: await this.validateRisks(),
      assets: await this.validateAssets()
    };

    return results;
  }

  private async validateControls() {
    const mongoCount = await this.getMongoCount('controls');
    const pgCount = await this.prisma.control.count();
    
    const samples = await this.compareSamples('controls', 10);
    
    return {
      mongoCount,
      pgCount,
      difference: mongoCount - pgCount,
      samples,
      valid: mongoCount === pgCount
    };
  }
}
```

### Performance Testing

```typescript
// src/tests/performance.test.ts
describe('Database Performance', () => {
  it('should query controls efficiently', async () => {
    const start = Date.now();
    
    const controls = await prisma.control.findMany({
      where: {
        folder: { organizationId: 'test-org' },
        status: 'IMPLEMENTED'
      },
      include: {
        owner: true,
        evidences: true
      },
      take: 100
    });
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50); // Should complete in under 50ms
  });
});
```

## Deliverables

### Week 1 Deliverables
- [X] PostgreSQL development environment
- [X] Initial Prisma schema (Full Phase 1 schema implemented)
- [ ] Migration strategy document (Partially covered in plan)

### Week 2 Deliverables
- [X] Complete database schema (Migrated and synced)
- [ ] Entity relationship diagram (Viewable via Prisma Studio)
- [ ] Index optimization plan (Initial indexes in schema)

### Week 3 Deliverables
- [ ] Migration scripts
- [ ] Data mapping utilities
- [ ] Rollback procedures

### Week 4 Deliverables
- [ ] Validation reports
- [ ] Performance benchmarks
- [ ] Go-live checklist

## Risk Mitigation

### Data Integrity
- Implement checksums for critical data
- Create detailed migration logs
- Maintain MongoDB backup for 30 days post-migration

### Performance
- Add database indexes based on query patterns
- Implement connection pooling
- Use read replicas for reporting queries

### Rollback Plan
1. Keep MongoDB instance running in read-only mode
2. Implement dual-write pattern if needed
3. Maintain migration reversal scripts

## Success Criteria

1. **Data Integrity**: 100% of data migrated without loss
2. **Performance**: Query response times < 50ms for 95th percentile
3. **Availability**: Zero downtime during migration
4. **Validation**: All data validation checks pass
5. **Testing**: 100% test coverage for migration code

## Next Steps

After successful completion of Phase 1:
- Begin Phase 2: Enhanced Domain Models
- Implement new Prisma-based repositories
- Update API endpoints to use new database
- Deploy to staging environment for UAT
