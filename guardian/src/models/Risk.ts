import mongoose, { Document, Schema, Model, Types } from 'mongoose'; // Standard import for types
// import mongooseInstance from '../lib/mongoose'; // Assuming this is a pre-configured instance if needed elsewhere, but for schema definition, standard mongoose is fine.
import { IFolder } from './Folder';
import { IChangeLog } from './ChangeLog'; // Assuming ChangeLog might be used for a more detailed changeHistory type

// Minimal interface for a populated folder reference
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for MitigationAction (subdocument)
export interface IMitigationAction extends Document {
  description: string;
  assignedTo?: { userId?: string; userEmail?: string };
  dueDate?: Date;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  progress: number;
  cost?: number;
  effectiveness?: number;
  notes?: string;
  completedDate?: Date;
}

// Interface for RiskAssessment (subdocument)
export interface IRiskAssessment extends Document {
  likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  score?: number;
  assessedBy?: { userId?: string; userEmail?: string };
  assessmentDate: Date;
  rationale?: string;
  evidence?: string;
}

// Main Risk Interface
export interface IRisk extends Document {
  title: string;
  description: string;
  category: 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Technology' | 
            'Cybersecurity' | 'Legal' | 'Reputational' | 'Environmental' | 'Health & Safety' |
            'Supply Chain' | 'Market' | 'Credit' | 'Liquidity' | 'Other';
  subcategory?: string;
  owner: { userId: string; userEmail: string };
  stakeholders?: Array<{ userId?: string; userEmail?: string; role?: string }>;
  currentAssessment?: IRiskAssessment; // Use defined interface
  historicalAssessments?: IRiskAssessment[]; // Use defined interface
  status: 'Identified' | 'Assessed' | 'Mitigated' | 'Monitored' | 'Closed' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationActions?: IMitigationAction[]; // Use defined interface
  residualRisk?: IRiskAssessment; // Use defined interface
  riskAppetite: 'Accept' | 'Transfer' | 'Mitigate' | 'Avoid';
  businessUnit?: string;
  project?: string;
  location?: string;
  regulatoryImpact?: string[];
  financialImpact?: { min?: number; max?: number; currency: string };
  identifiedDate: Date;
  targetResolutionDate?: Date;
  nextReviewDate?: Date;
  attachments?: Array<{ url: string; name: string; uploadedBy?: { userId?: string; userEmail?: string }; uploadedAt: Date }>;
  comments?: Array<{ text: string; userId?: string; userEmail?: string; date: Date }>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>; // Consider a more specific IChangeLog if available and suitable
  tags?: string[];
  confidentiality: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  linkedRisks?: Array<Types.ObjectId | IRisk>;
  linkedCompliance?: Types.ObjectId[]; // Assuming Compliance model exists
  linkedPolicies?: Types.ObjectId[];   // Assuming Policy model exists
  linkedControls?: Types.ObjectId[];   // Assuming Control model exists
  linkedIncidents?: string[];
  folder: Types.ObjectId | IPopulatedFolderMin; // Link to the folder

  // Virtuals (not stored in DB, computed)
  riskScore?: number;
  riskLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MitigationActionSchema = new Schema<IMitigationAction>({
  description: { type: String, required: true },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Not Started' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 }, // Percentage complete
  cost: { type: Number },
  effectiveness: { type: Number, min: 1, max: 5 }, // 1-5 scale
  notes: { type: String },
  completedDate: { type: Date },
}, { timestamps: true });

const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  likelihood: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], 
    required: true 
  },
  impact: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'], 
    required: true 
  },
  score: { type: Number, min: 1, max: 25 }, // Calculated field
  assessedBy: {
    userId: { type: String },
    userEmail: { type: String },
  },
  assessmentDate: { type: Date, default: Date.now },
  rationale: { type: String },
  evidence: { type: String },
}, { timestamps: true });

const RiskSchema = new Schema<IRisk>({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Strategic', 'Operational', 'Financial', 'Compliance', 'Technology', 
      'Cybersecurity', 'Legal', 'Reputational', 'Environmental', 'Health & Safety',
      'Supply Chain', 'Market', 'Credit', 'Liquidity', 'Other'
    ],
    required: true 
  },
  subcategory: { type: String },
  
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
  
  // Risk Assessment
  currentAssessment: RiskAssessmentSchema,
  historicalAssessments: [RiskAssessmentSchema],
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Identified', 'Assessed', 'Mitigated', 'Monitored', 'Closed', 'Escalated'], 
    default: 'Identified' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  
  // Mitigation
  mitigationActions: [MitigationActionSchema],
  residualRisk: RiskAssessmentSchema, // Risk level after mitigation
  riskAppetite: { 
    type: String, 
    enum: ['Accept', 'Transfer', 'Mitigate', 'Avoid'], 
    default: 'Mitigate' 
  },
  
  // Business Context
  businessUnit: { type: String },
  project: { type: String },
  location: { type: String },
  regulatoryImpact: [{ type: String }], // List of affected regulations
  
  // Financial Impact
  financialImpact: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  
  // Timeline
  identifiedDate: { type: Date, default: Date.now },
  targetResolutionDate: { type: Date },
  nextReviewDate: { type: Date },
  
  // Attachments & Documentation
  attachments: [{ 
    url: String, 
    name: String, 
    uploadedBy: { userId: String, userEmail: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
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
  
  // Integration
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedCompliance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliance' }],
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  linkedControls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }], // IDs of related controls
  linkedIncidents: [{ type: String }], // IDs of related incidents
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated risk score
RiskSchema.virtual('riskScore').get(function(this: IRisk) {
  if (this.currentAssessment && this.currentAssessment.likelihood && this.currentAssessment.impact) {
    const likelihoodScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const impactScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    
    const likelihoodScore = likelihoodScores[this.currentAssessment.likelihood] || 3;
    const impactScore = impactScores[this.currentAssessment.impact] || 3;
    
    return likelihoodScore * impactScore;
  }
  return null;
});

// Virtual for risk level based on score
RiskSchema.virtual('riskLevel').get(function(this: IRisk) {
  const score = (this as any).riskScore;
  if (!score) return 'Unknown';
  if (score <= 4) return 'Low';
  if (score <= 8) return 'Medium';
  if (score <= 15) return 'High';
  return 'Critical';
});

// Pre-save middleware to calculate risk score
RiskSchema.pre<IRisk>('save', function(next) {
  if (this.currentAssessment && this.currentAssessment.likelihood && this.currentAssessment.impact) {
    const likelihoodScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const impactScores = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    
    const likelihoodScore = likelihoodScores[this.currentAssessment.likelihood] || 3;
    const impactScore = impactScores[this.currentAssessment.impact] || 3;
    
    this.currentAssessment.score = likelihoodScore * impactScore;
  }
  next();
});

// Indexes for performance
RiskSchema.index({ status: 1, priority: 1 });
RiskSchema.index({ category: 1, status: 1 });
RiskSchema.index({ owner: 1 });
RiskSchema.index({ 'currentAssessment.score': -1 });
RiskSchema.index({ nextReviewDate: 1 });
RiskSchema.index({ tags: 1 });
RiskSchema.index({ folder: 1 }); // Index for folder field

export interface IRiskPopulatedFolder extends Omit<IRisk, 'folder' | 'save' | 'populate' | 'depopulate' | 'validate' | 'update' | 'remove' | 'delete' | 'deleteOne' | 'replaceOne' | 'set' | 'isModified' | 'isDirectModified' | 'isInit' | 'isSelected' | 'markModified' | 'unmarkModified' | 'equals' | '$isDefault' | '$isDeleted' | '$isNew' | '$isValid' | '$locals' | '$op' | '$session' | '$set' | '$where' | 'directModifiedPaths' | 'errors' | 'get' | 'getChanges' | 'increment' | 'invalidate' | 'isDirectSelected' | 'model' | 'overwrite' | 'populated' | 'schema' | 'toJSON' | 'toObject' | 'toString' | 'validateSync'> {
  folder: IPopulatedFolderMin;
}

export const Risk = (mongoose.models.Risk as Model<IRisk>) || mongoose.model<IRisk>('Risk', RiskSchema);
export default Risk; 