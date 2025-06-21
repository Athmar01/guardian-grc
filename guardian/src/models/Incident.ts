import mongoose, { Document, Schema, Types, Model } from '../lib/mongoose';

const IncidentUpdateSchema = new mongoose.Schema({
  update: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['Status Change', 'Investigation', 'Resolution', 'Escalation', 'Communication'], 
    default: 'Status Change' 
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Interface for a minimally populated folder (e.g., when using .populate('folder', '_id name'))
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

const IncidentActionSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String },
  assignedTo: {
    userId: { type: String },
    userEmail: { type: String },
  },
  dueDate: { type: Date },
  completedDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  notes: { type: String },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const IncidentEvidenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['Document', 'Screenshot', 'Log File', 'Video', 'Audio', 'Physical', 'Other'], 
    required: true 
  },
  url: { type: String },
  uploadedBy: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  uploadedAt: { type: Date, default: Date.now },
  chainOfCustody: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String }, // e.g., 'Received', 'Transferred', 'Analyzed'
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  tags: [{ type: String }]
}, { timestamps: true });

// Main Incident Interface (extending Document)
export interface IIncident extends Document {
  incidentNumber?: string;
  title: string;
  description: string;
  summary?: string;
  category: 'Security Incident' | 'Data Breach' | 'System Outage' | 'Compliance Violation' | 'Physical Security' | 'Human Error' | 'Malware' | 'Phishing' | 'Unauthorized Access' | 'Data Loss' | 'Network Attack' | 'Application Failure' | 'Infrastructure Issue' | 'Third Party Incident' | 'Natural Disaster' | 'Other';
  subcategory?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Open' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed' | 'Escalated';
  stage?: 'Detection' | 'Analysis' | 'Containment' | 'Eradication' | 'Recovery' | 'Lessons Learned';
  detectedAt: Date;
  reportedAt: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  slaTarget?: Date;
  slaBreached?: boolean;
  impact?: {
    business?: string;
    financial?: string;
    operational?: string;
    reputational?: string;
    regulatory?: string;
  };
  affectedSystems?: string[];
  affectedUsers?: number;
  affectedData?: string;
  estimatedCost?: number;
  actualCost?: number;
  reporter: {
    userId: string;
    userEmail: string;
  };
  owner: {
    userId: string;
    userEmail: string;
  };
  assignee?: {
    userId?: string;
    userEmail?: string;
  };
  stakeholders?: Array<{
    userId?: string;
    userEmail?: string;
    role?: string;
  }>;
  updates?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentUpdateSchema content
  actions?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentActionSchema content
  evidence?: Types.DocumentArray<any>; // Consider creating a specific type for IncidentEvidenceSchema content
  rootCause?: string;
  contributingFactors?: string[];
  lessonsLearned?: string;
  internalCommunications?: Array<{
    audience?: string;
    message?: string;
    sentAt?: Date;
    sentBy?: { userId?: string; userEmail?: string };
  }>;
  externalCommunications?: Array<{
    audience?: string;
    message?: string;
    sentAt?: Date;
    sentBy?: { userId?: string; userEmail?: string };
    approvedBy?: { userId?: string; userEmail?: string };
  }>;
  regulatoryReporting?: {
    required?: boolean;
    reported?: boolean;
    reportDate?: Date;
    authority?: string;
    reportNumber?: string;
    deadline?: Date;
  };
  legalInvolvement?: {
    required?: boolean;
    lawFirm?: string;
    caseNumber?: string;
    estimatedCost?: number;
  };
  linkedIncidents?: Types.ObjectId[];
  linkedRisks?: Types.ObjectId[];
  linkedCompliance?: Types.ObjectId[];
  linkedPolicies?: Types.ObjectId[];
  tags?: string[];
  confidentiality?: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date?: Date;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }>;
  folder: Types.ObjectId | IPopulatedFolderMin; // Added folder field
  createdAt?: Date;
  updatedAt?: Date;

  // Virtuals (if you want them in the interface)
  duration?: number;
  slaStatus?: string;
  openActionsCount?: number;
  criticalActionsCount?: number;
}

// Interface for IIncident when its 'folder' field is populated
export interface IIncidentPopulatedFolder extends Omit<IIncident, 'folder' | 'updates' | 'actions' | 'evidence' | 'changeHistory' | 'duration' | 'slaStatus' | 'openActionsCount' | 'criticalActionsCount' > { // Omit virtuals and complex sub-docs if they cause issues with Omit
  folder: IPopulatedFolderMin;
  // Re-declare complex sub-documents if Omit has issues, or ensure they are compatible
  // For simplicity, if Omit causes issues with DocumentArray or deeply nested types, 
  // you might need to list all fields manually except 'folder' and then add 'folder: IPopulatedFolderMin'.
  // Alternatively, ensure IIncident fields are plain objects/arrays for easier Omit compatibility.
  // For now, let's assume Omit works or we simplify the IIncident for this purpose.
  // A more robust Omit might look like: Omit<IIncident, 'folder' | keyof Document> and then add folder + Document methods if needed.
  // Or, more simply for lean objects:
  // incidentNumber?: string;
  // title: string; ... etc. all fields from IIncident except 'folder'
  // folder: IPopulatedFolderMin;
}


const IncidentSchema = new mongoose.Schema({
  // Basic Information
  incidentNumber: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String },
  
  // Classification
  category: { 
    type: String, 
    enum: [
      'Security Incident', 'Data Breach', 'System Outage', 'Compliance Violation',
      'Physical Security', 'Human Error', 'Malware', 'Phishing', 'Unauthorized Access',
      'Data Loss', 'Network Attack', 'Application Failure', 'Infrastructure Issue',
      'Third Party Incident', 'Natural Disaster', 'Other'
    ],
    required: true 
  },
  subcategory: { type: String },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    required: true 
  },
  
  // Status & Lifecycle
  status: { 
    type: String, 
    enum: ['Open', 'Investigating', 'Contained', 'Resolved', 'Closed', 'Escalated'], 
    default: 'Open' 
  },
  stage: { 
    type: String, 
    enum: ['Detection', 'Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned'], 
    default: 'Detection' 
  },
  
  // Timeline
  detectedAt: { type: Date, required: true },
  reportedAt: { type: Date, required: true },
  containedAt: { type: Date },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  slaTarget: { type: Date },
  slaBreached: { type: Boolean, default: false },
  
  // Impact Assessment
  impact: {
    business: { type: String },
    financial: { type: String },
    operational: { type: String },
    reputational: { type: String },
    regulatory: { type: String }
  },
  affectedSystems: [{ type: String }],
  affectedUsers: { type: Number },
  affectedData: { type: String },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  
  // Ownership & Responsibility
  reporter: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  assignee: {
    userId: { type: String },
    userEmail: { type: String },
  },
  stakeholders: [{
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String }, // e.g., 'Investigator', 'Communications', 'Legal', 'Management'
  }],
  
  // Investigation & Response
  updates: [IncidentUpdateSchema],
  actions: [IncidentActionSchema],
  evidence: [IncidentEvidenceSchema],
  
  // Root Cause Analysis
  rootCause: { type: String },
  contributingFactors: [{ type: String }],
  lessonsLearned: { type: String },
  
  // Communication
  internalCommunications: [{
    audience: { type: String }, // e.g., 'All Staff', 'Management', 'IT Team'
    message: { type: String },
    sentAt: { type: Date, default: Date.now },
    sentBy: { userId: String, userEmail: String }
  }],
  externalCommunications: [{
    audience: { type: String }, // e.g., 'Customers', 'Regulators', 'Media'
    message: { type: String },
    sentAt: { type: Date, default: Date.now },
    sentBy: { userId: String, userEmail: String },
    approvedBy: { userId: String, userEmail: String }
  }],
  
  // Regulatory & Legal
  regulatoryReporting: {
    required: { type: Boolean, default: false },
    reported: { type: Boolean, default: false },
    reportDate: { type: Date },
    authority: { type: String },
    reportNumber: { type: String },
    deadline: { type: Date }
  },
  legalInvolvement: {
    required: { type: Boolean, default: false },
    lawFirm: { type: String },
    caseNumber: { type: String },
    estimatedCost: { type: Number }
  },
  
  // Integration
  linkedIncidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
  linkedRisks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Risk' }],
  linkedCompliance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compliance' }],
  linkedPolicies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
  
  // Tags & Classification
  tags: [{ type: String }],
  confidentiality: { 
    type: String, 
    enum: ['Public', 'Internal', 'Confidential', 'Restricted'], 
    default: 'Internal' 
  },
  
  // Audit Trail
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true }, // Added folder field to schema
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
  }],
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for incident duration
IncidentSchema.virtual('duration').get(function() {
  const endDate = this.resolvedAt || this.closedAt || new Date();
  return Math.floor((endDate.getTime() - this.detectedAt.getTime()) / (1000 * 60 * 60 * 24)); // Days
});

// Virtual for SLA status
IncidentSchema.virtual('slaStatus').get(function() {
  if (!this.slaTarget) return 'No SLA';
  const now = new Date();
  if (this.resolvedAt && this.resolvedAt <= this.slaTarget) return 'Met';
  if (now > this.slaTarget) return 'Breached';
  return 'In Progress';
});

// Virtual for open actions count
IncidentSchema.virtual('openActionsCount').get(function() {
  if (!this.actions) return 0;
  return this.actions.filter(action => action.status !== 'Completed').length;
});

// Virtual for critical actions count
IncidentSchema.virtual('criticalActionsCount').get(function() {
  if (!this.actions) return 0;
  return this.actions.filter(action => 
    action.priority === 'Critical' && action.status !== 'Completed'
  ).length;
});

// Pre-save middleware to generate incident number
IncidentSchema.pre('save', async function(next) {
  if (this.isNew && !this.incidentNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Incident').countDocuments({
      incidentNumber: new RegExp(`^INC-${year}-`)
    });
    this.incidentNumber = `INC-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update SLA breached status
IncidentSchema.pre('save', function(next) {
  if (this.slaTarget && new Date() > this.slaTarget && this.status !== 'Resolved' && this.status !== 'Closed') {
    this.slaBreached = true;
  }
  next();
});

// Indexes for performance
IncidentSchema.index({ incidentNumber: 1 });
IncidentSchema.index({ status: 1, severity: 1 });
IncidentSchema.index({ category: 1, priority: 1 });
IncidentSchema.index({ owner: 1 });
IncidentSchema.index({ detectedAt: 1 });
IncidentSchema.index({ slaTarget: 1 });
IncidentSchema.index({ tags: 1 });

export default mongoose.models.Incident || mongoose.model('Incident', IncidentSchema); 