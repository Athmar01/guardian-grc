import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/audit-log
 *
 * Retrieves a list of audit log entries (ChangeLog).
 * Access is restricted to organization administrators.
 *
 * @returns {Promise<NextResponse>}
 */
export async function GET(req: NextRequest) {
    try {
        const { userId, orgRole } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only organization administrators can view the audit log
        if (orgRole !== 'org:admin') {
             return NextResponse.json({ error: 'Forbidden: You do not have permission to view audit logs.' }, { status: 403 });
        }

        const logs = await prisma.changeLog.findMany({
            orderBy: {
                changedAt: 'desc',
            },
            // Include details of the user who made the change
            include: {
                changedBy: { // This assumes a 'changedBy' relation on ChangeLog to a User model
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            take: 200, // Paginate for performance
        });

        return NextResponse.json(logs);

    } catch (e: unknown) {
        console.error('[AUDIT_LOG_GET]', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        // Check for relation error, which might indicate a schema mismatch
        if (errorMessage.includes("relation")) {
             console.error("Prisma schema error: The 'changedBy' relation on 'ChangeLog' might be missing or misconfigured.");
             return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}