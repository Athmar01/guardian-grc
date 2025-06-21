import { PrismaClient, UserRole, RiskLevel, RiskStatus, TreatmentStatus, TreatmentType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { calculateRiskLevel } from '../src/lib/risk-utils';

const prisma = new PrismaClient();

async function main() {
  // Create test organization
  let organization = await prisma.organization.upsert({
    where: { name: 'Test Organization' },
    update: {},
    create: {
      name: 'Test Organization',
      description: 'Test organization for development',
    },
  });

  // Create test users
  const hashedPassword = await hash('password123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      organizationId: organization.id,
    },
  });

  const riskManager = await prisma.user.upsert({
    where: { email: 'risk.manager@example.com' },
    update: {},
    create: {
      email: 'risk.manager@example.com',
      name: 'Risk Manager',
      password: hashedPassword,
      role: UserRole.RISK_MANAGER,
      organizationId: organization.id,
    },
  });

  const securityAnalyst = await prisma.user.upsert({
    where: { email: 'security@example.com' },
    update: {},
    create: {
      email: 'security@example.com',
      name: 'Security Analyst',
      password: hashedPassword,
      role: UserRole.USER,
      organizationId: organization.id,
    },
  });

  // Create test frameworks
  const frameworks = [
    {
      name: 'ISO 27001:2022',
      version: '2022',
      urn: 'urn:iso:std:iso-iec:27001:ed-3',
      description: 'Information security, cybersecurity and privacy protection',
      isCustom: false,
    },
    {
      name: 'NIST CSF',
      version: '1.1',
      urn: 'urn:nist:csf:1.1',
      description: 'NIST Cybersecurity Framework',
      isCustom: false,
    },
    {
      name: 'GDPR',
      version: '2016/679',
      urn: 'eur-lex:europa:gdpr:2016/679',
      description: 'General Data Protection Regulation',
      isCustom: false,
    },
  ];

  for (const framework of frameworks) {
    await prisma.framework.upsert({
      where: { urn: framework.urn },
      update: {},
      create: {
        ...framework,
        organizationId: organization.id,
        createdById: adminUser.id,
        updatedById: adminUser.id,
      },
    });
  }

  // Create risk matrix
  const riskMatrix = await prisma.riskMatrix.upsert({
    where: { name_organizationId: { name: 'Default Risk Matrix', organizationId: organization.id } },
    update: {},
    create: {
      name: 'Default Risk Matrix',
      description: 'Default risk matrix for the organization',
      organizationId: organization.id,
      isDefault: true,
      config: {
        impact: [
          { value: 1, label: 'Insignificant', description: 'Minimal impact' },
          { value: 2, label: 'Minor', description: 'Minor impact' },
          { value: 3, label: 'Moderate', description: 'Moderate impact' },
          { value: 4, label: 'Major', description: 'Major impact' },
          { value: 5, label: 'Catastrophic', description: 'Catastrophic impact' },
        ],
        likelihood: [
          { value: 1, label: 'Rare', description: 'May occur only in exceptional circumstances' },
          { value: 2, label: 'Unlikely', description: 'Could occur sometime' },
          { value: 3, label: 'Possible', description: 'Might occur occasionally' },
          { value: 4, label: 'Likely', description: 'Will probably occur' },
          { value: 5, label: 'Almost Certain', description: 'Expected to occur' },
        ],
        riskLevels: [
          { min: 1, max: 4, level: 'LOW', color: '#10B981' }, // Green
          { min: 5, max: 9, level: 'MEDIUM', color: '#F59E0B' }, // Yellow
          { min: 10, max: 16, level: 'HIGH', color: '#EF4444' }, // Red
          { min: 17, max: 25, level: 'CRITICAL', color: '#7F1D1D' }, // Dark Red
        ],
      },
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  });

  // Create sample risks
  const risks = [
    {
      title: 'Unauthorized Access to Sensitive Data',
      description: 'Risk of unauthorized access to sensitive customer data due to weak access controls.',
      category: 'Data Security',
      impact: 5,
      likelihood: 3,
      status: 'EVALUATED' as RiskStatus,
      ownerId: riskManager.id,
      tags: ['data', 'access-control', 'security'],
    },
    {
      title: 'Phishing Attacks on Employees',
      description: 'Employees falling victim to phishing attacks leading to credential compromise.',
      category: 'Security Awareness',
      impact: 4,
      likelihood: 4,
      status: 'TREATING' as RiskStatus,
      ownerId: securityAnalyst.id,
      tags: ['phishing', 'security-awareness', 'training'],
    },
    {
      title: 'Outdated Software Vulnerabilities',
      description: 'Running outdated software with known security vulnerabilities.',
      category: 'Patch Management',
      impact: 4,
      likelihood: 2,
      status: 'IDENTIFIED' as RiskStatus,
      ownerId: securityAnalyst.id,
      tags: ['patching', 'vulnerability', 'it'],
    },
  ];

  for (const riskData of risks) {
    const inherentRisk = riskData.impact * riskData.likelihood;
    const riskLevel = calculateRiskLevel(inherentRisk);
    
    const risk = await prisma.risk.create({
      data: {
        ...riskData,
        inherentRisk,
        riskLevel,
        createdById: adminUser.id,
        organizationId: organization.id,
        riskMatrixId: riskMatrix.id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      },
    });

    // Create risk assessment
    await prisma.riskAssessment.create({
      data: {
        riskId: risk.id,
        assessedById: riskData.ownerId,
        organizationId: organization.id,
        impact: riskData.impact,
        likelihood: riskData.likelihood,
        riskScore: inherentRisk,
        notes: 'Initial risk assessment',
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        isCurrent: true,
      },
    });

    // Create treatments for high/critical risks
    if (inherentRisk >= 10) {
      await prisma.riskTreatment.create({
        data: {
          riskId: risk.id,
          type: 'MITIGATE' as TreatmentType,
          title: `Mitigation plan for ${riskData.title}`,
          description: 'Implement additional security controls to reduce risk',
          status: 'PLANNED' as TreatmentStatus,
          assignedToId: riskData.ownerId,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          organizationId: organization.id,
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
    }
  }

  console.log('Database seeded successfully with risk management data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
