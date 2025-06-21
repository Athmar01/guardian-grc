// src/migration/mappers/controlMapper.ts
import { Control as MongoControl } from '@/models/Control'; // Assuming this path is correct for your Mongo models
import { Prisma, ControlStatus } from '@prisma/client';

// Placeholder for actual MongoControl type if the import path is incorrect or type is different
// You might need to define a simplified interface here if the actual MongoControl is complex or not easily importable
interface SimplifiedMongoControl {
  _id: any; // Adjust 'any' to actual type, e.g., ObjectId from 'mongodb'
  controlId: string;
  name: string;
  description?: string | null;
  family?: string | null;
  status: string; // Assuming status is a string in MongoDB
  effectiveness?: number | null;
  folder: any; // Adjust 'any' to actual type, e.g., ObjectId or string
  owner?: any | null; // Adjust 'any' to actual type, e.g., ObjectId or string
  createdAt: Date;
  updatedAt: Date;
  // Add any other fields from your MongoDB Control model that are needed for mapping
}

export class ControlMapper {
  static toPrisma(mongoControl: SimplifiedMongoControl): Prisma.ControlCreateInput {
    return {
      // id: mongoControl._id.toString(), // Prisma typically auto-generates UUIDs, so mapping _id to id might not be needed unless you want to preserve them
      controlId: mongoControl.controlId,
      name: mongoControl.name,
      description: mongoControl.description,
      family: mongoControl.family,
      status: this.mapStatus(mongoControl.status),
      effectiveness: mongoControl.effectiveness,
      folder: {
        connect: { id: mongoControl.folder.toString() } // Assuming folder ID is a string or can be converted
      },
      owner: mongoControl.owner ? {
        connect: { id: mongoControl.owner.toString() } // Assuming owner ID is a string or can be converted
      } : undefined,
      metadata: {
        mongoId: mongoControl._id.toString(),
        migratedAt: new Date().toISOString(),
        // originalData: mongoControl // Storing entire original object might be too large; consider only essential fields
      },
      createdAt: mongoControl.createdAt,
      updatedAt: mongoControl.updatedAt
      // createdBy and updatedBy fields are not in SimplifiedMongoControl, add if available
    };
  }

  private static mapStatus(mongoStatus: string): ControlStatus {
    const statusMap: Record<string, ControlStatus> = {
      'draft': ControlStatus.DRAFT,
      'in-review': ControlStatus.IN_REVIEW,
      'approved': ControlStatus.APPROVED,
      'implemented': ControlStatus.IMPLEMENTED,
      'deprecated': ControlStatus.DEPRECATED
    };
    // Ensure all possible mongo statuses are handled or have a default
    const mappedStatus = statusMap[mongoStatus.toLowerCase()];
    if (!mappedStatus) {
      console.warn(`Unmapped MongoDB control status: '${mongoStatus}'. Defaulting to DRAFT.`);
      return ControlStatus.DRAFT;
    }
    return mappedStatus;
  }
}
