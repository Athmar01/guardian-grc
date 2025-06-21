import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing
// import { IControl } from './Control'; // If linkedControls are to be populated
// import { IRisk } from './Risk'; // If linkedRisks are to be populated
// import { IPolicy } from './Policy'; // If linkedPolicies are to be populated

// Minimal interface for a populated folder with only _id and name
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for Requirement (subdocument)
export interface IRequirement extends Document {
  title: string;
  description?: string;
  reference?: string;
  category?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Under Review' | 'Met' | 'Partially Met' | 'Not Applicable'; // Added Met, Partially Met, Not Applicable from virtual
  evidence?: Array<{
    description?: string;
    url?: string;
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
    reviewedBy?: { userId?: string; userEmail?: string };
    reviewedAt?: Date;
    status: 'Pending' | 'Approved' | 'Rejected';
  }>;
  controls?: string[]; // Consider Types.ObjectId[] | IControl[] if populating
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  notes?: string;
}

// Interface for Gap (subdocument)
export interface IGap extends Document {
  title: string;
  description: string;
  requirementId?: Types.ObjectId | IRequirement;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impact?: string;
  remediationPlan?: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  progress: number;
  cost?: number;
  completedDate?: Date;
  notes?: string;
}

// Interface for AuditFinding (subdocument)
export interface IAuditFinding extends Document {
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category?: string;
  requirementId?: Types.ObjectId | IRequirement;
  evidence?: Array<{
    description?: string;
    url?: string;
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
  }>;
  remediationPlan?: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  progress: number;
  completedDate?: Date;
  notes?: string;
}

// Interface for AuditSession (subdocument for Compliance)
export interface IAuditSession extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  auditor?: { userId?: string; userEmail?: string; name?: string };
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  scope?: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

// Schema for AuditSession (subdocument for Compliance)
const AuditSessionSchema = new Schema<IAuditSession>({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  auditor: {
    userId: { type: String },
    userEmail: { type: String },
    name: { type: String },
  },
  status: { 
    type: String, 
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Planned' 
  },
  scope: { type: String },
}, { timestamps: true });

// Main Compliance Interface
export interface ICompliance extends Document {
  name: string;
  description?: string;
  type: 'Regulation' | 'Standard' | 'Framework' | 'Policy';
  category: 'Data Protection' | 'Cybersecurity' | 'Financial' | 'Environmental' | 
            'Health & Safety' | 'Quality Management' | 'Information Security' |
            'Business Continuity' | 'Risk Management' | 'Other';
  jurisdiction?: string;
  authority?: string;
  version?: string;
  effectiveDate?: Date;
  reviewFrequency: 'Monthly' | 'Quarterly' | 'Annually' | 'Biennially';
  status: 'Active' | 'Inactive' | 'Superseded' | 'Under Review';
  complianceLevel: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Under Assessment';
  owner: { userId: string; userEmail: string };
  stakeholders?: Array<{ userId?: string; userEmail?: string; role?: string }>;
  requirements?: IRequirement[];
  gaps?: IGap[];
  auditFindings?: IAuditFinding[];
  auditSessions?: IAuditSession[]; // Added audit sessions
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  documents?: Array<{
    title?: string;
    url?: string;
    type?: 'Policy' | 'Procedure' | 'Evidence' | 'Report' | 'Other';
    uploadedBy?: { userId?: string; userEmail?: string };
    uploadedAt: Date;
  }>;
  complianceCost?: { annual?: number; oneTime?: number; currency: string };
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore?: number;
  linkedRisks?: Array<Types.ObjectId /*| IRisk*/>; // Assuming IRisk exists
  linkedControls?: Array<Types.ObjectId /*| IControl*/>; // Assuming IControl exists
  linkedPolicies?: Array<Types.ObjectId /*| IPolicy*/>; // Assuming IPolicy exists
  comments?: Array<{ text: string; userId?: string; userEmail?: string; date: Date }>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>;
  tags?: string[];
  confidentiality: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  folder: Types.ObjectId | IPopulatedFolderMin; // Updated to use IPopulatedFolderMin // Link to the folder

  // Virtuals
  complianceScore?: number;
  openGapsCount?: number;
  criticalFindingsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Compliance document with folder populated minimally
export interface ICompliancePopulatedFolder extends Omit<ICompliance, 'folder'> {
  folder: IPopulatedFolderMin;
}

const RequirementSchema = new Schema<IRequirement>({
  title: { type: String, required: true },
  description: { type: String },
  reference: { type: String }, // Regulatory reference number
  category: { type: String },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Under Review'], 
    default: 'Under Review' 
  },
  evidence: [{ 
    description: String,
    url: String,
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now },
    reviewedBy: { userId: String, userEmail: String },
    reviewedAt: Date,
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    }
  }],
  controls: [{ type: String }], // IDs of related controls
  lastReviewDate: { type: Date },
  nextReviewDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const GapSchema = new Schema<IGap>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  impact: { type: String },
  remediationPlan: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  cost: { type: Number },
  completedDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const AuditFindingSchema = new Schema<IAuditFinding>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  category: { type: String },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
  evidence: [{ 
    description: String,
    url: String,
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  remediationPlan: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  completedDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const ComplianceSchema = new Schema<ICompliance>({
  // Basic Information
  name: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Regulation', 'Standard', 'Framework', 'Policy'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: [
      'Data Protection', 'Cybersecurity', 'Financial', 'Environmental', 
      'Health & Safety', 'Quality Management', 'Information Security',
      'Business Continuity', 'Risk Management', 'Other'
    ],
    required: true 
  },
  
  // Regulatory Information
  jurisdiction: { type: String }, // e.g., 'EU', 'US', 'Global'
  authority: { type: String }, // e.g., 'GDPR', 'ISO', 'NIST'
  version: { type: String },
  effectiveDate: { type: Date },
  reviewFrequency: { 
    type: String, 
    enum: ['Monthly', 'Quarterly', 'Annually', 'Biennially'], 
    default: 'Annually' 
  },
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Superseded', 'Under Review'], 
    default: 'Active' 
  },
  complianceLevel: { 
    type: String, 
    enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Under Assessment'], 
    default: 'Under Assessment' 
  },
  
  // Ownership & Responsibility
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  stakeholders: [{
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String }, // e.g., 'Reviewer', 'Approver', 'Implementer'
  }],
  
  // Requirements & Controls
  requirements: [RequirementSchema],
  gaps: [GapSchema],
  auditFindings: [AuditFindingSchema],
  auditSessions: [AuditSessionSchema], // Added audit sessions schema
  
  // Timeline
  lastAssessmentDate: { type: Date },
  nextAssessmentDate: { type: Date },
  lastAuditDate: { type: Date },
  nextAuditDate: { type: Date },
  
  // Documentation
  documents: [{ 
    title: String,
    url: String,
    type: { 
      type: String, 
      enum: ['Policy', 'Procedure', 'Evidence', 'Report', 'Other'] 
    },
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Financial Impact
  complianceCost: {
    annual: { type: Number },
    oneTime: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  
  // Risk Assessment
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  riskScore: { type: Number, min: 1, max: 25 },
  
  // Integration
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedControls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }], // IDs of related controls
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  
  // Comments & Collaboration
  comments: [{
    text: { type: String, required: true },
    userId: { type: String },
    userEmail: { type: String },
    date: { type: Date, default: Date.now },
  }],
  
  // Audit Trail
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  }],
  
  // Tags & Classification
  tags: [{ type: String }],
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'], 
    default: 'Internal' 
  },
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for compliance score calculation
ComplianceSchema.virtual('complianceScore').get(function(this: ICompliance) {
  if (!this.requirements || this.requirements.length === 0) return 0;
  
  const totalRequirements = this.requirements.length;
  const compliantRequirements = this.requirements.filter(req => req.status === 'Compliant').length;
  const partiallyCompliantRequirements = this.requirements.filter(req => req.status === 'Partially Compliant').length;
  
  return Math.round(((compliantRequirements + (partiallyCompliantRequirements * 0.5)) / totalRequirements) * 100);
});

// Virtual for gap count
ComplianceSchema.virtual('openGapsCount').get(function(this: ICompliance) {
  if (!this.gaps) return 0;
  return this.gaps.filter(gap => gap.status !== 'Closed').length;
});

// Virtual for critical findings count
ComplianceSchema.virtual('criticalFindingsCount').get(function(this: ICompliance) {
  if (!this.auditFindings) return 0;
  return this.auditFindings.filter(finding => 
    finding.severity === 'Critical' && finding.status !== 'Closed'
  ).length;
});

// Virtual for calculating compliance score
ComplianceSchema.virtual('complianceScore').get(function(this: ICompliance) {
  if (!this.requirements || this.requirements.length === 0) {
    return 100;
  }
  const applicableRequirements = this.requirements.filter(
    (req: { status: string; }) => req.status !== 'Not Applicable'
  );
  if (applicableRequirements.length === 0) {
    return 100;
  }
  const metCount = applicableRequirements.filter(
    (req: { status: string; }) => req.status === 'Met'
  ).length;
  const partiallyMetCount = applicableRequirements.filter(
    (req: { status: string; }) => req.status === 'Partially Met'
  ).length;
  
  const score = ((metCount + (partiallyMetCount * 0.5)) / applicableRequirements.length) * 100;
  return Math.round(score);
});

// Pre-save middleware to update compliance level based on score
ComplianceSchema.pre<ICompliance>('save', function(this: ICompliance, next) { // Added this type for clarity
  const score = this.complianceScore ?? 0; // Handle potentially undefined score
  if (score >= 90) {
    this.complianceLevel = 'Compliant';
  } else if (score >= 70) {
    this.complianceLevel = 'Partially Compliant';
  } else {
    this.complianceLevel = 'Non-Compliant';
  }
  next();
});

// Indexes for performance
ComplianceSchema.index({ type: 1, status: 1 });
ComplianceSchema.index({ category: 1, complianceLevel: 1 });
ComplianceSchema.index({ owner: 1 });
ComplianceSchema.index({ nextAssessmentDate: 1 });
ComplianceSchema.index({ nextAuditDate: 1 });
ComplianceSchema.index({ tags: 1 });
ComplianceSchema.index({ jurisdiction: 1, authority: 1 });
ComplianceSchema.index({ folder: 1 }); // Index for folder field

export const Compliance = (mongoose.models.Compliance as Model<ICompliance>) || mongoose.model<ICompliance>('Compliance', ComplianceSchema);
export default Compliance; 