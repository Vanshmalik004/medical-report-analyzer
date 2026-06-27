import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Fetch specific report
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // 3. Verify user ownership
    if (report.userId !== decoded.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4. Return parsed JSON contents
    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        fileName: report.fileName,
        fileType: report.fileType,
        reportName: report.reportName,
        summary: JSON.parse(report.summary),
        findings: JSON.parse(report.findings),
        severity: report.severity,
        alerts: JSON.parse(report.alerts),
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Fetch specific report error:", error);
    return NextResponse.json({ error: "Failed to fetch report details" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Fetch specific report
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // 3. Verify ownership
    if (report.userId !== decoded.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 4. Delete report
    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
