import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { extractText } from "@/lib/ocr";
import { analyzeReportText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
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

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientExtractedText = formData.get("extractedText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type;

    // Convert file to Node buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Extract text (PDF parse, or use client-side OCR text if provided)
    let extractedText = clientExtractedText || "";
    if (!extractedText.trim()) {
      try {
        extractedText = await extractText(buffer, fileType || fileName);
      } catch (ocrErr: any) {
        console.error("Text extraction failed:", ocrErr);
        return NextResponse.json(
          { error: `Failed to read report: ${ocrErr.message || "Unknown error"}` },
          { status: 422 }
        );
      }
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not find any readable text in the document. Please ensure it's not blurry or empty." },
        { status: 422 }
      );
    }

    // 4. Run AI Analysis
    const analysis = await analyzeReportText(extractedText);

    // 5. Store in Database
    const report = await prisma.report.create({
      data: {
        userId: decoded.userId,
        fileName,
        fileType: fileType || (fileName.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
        reportName: analysis.reportName || "Medical Report",
        summary: JSON.stringify(analysis.summary),
        findings: JSON.stringify(analysis.findings),
        severity: analysis.severity || "Normal",
        alerts: JSON.stringify(analysis.alerts),
      },
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: "Report uploaded and analyzed successfully",
    });
  } catch (error: any) {
    console.error("Report upload & analysis error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during report processing" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Get user's report history
    const reports = await prisma.report.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reportName: true,
        fileName: true,
        severity: true,
        createdAt: true,
        summary: true, // We will parse it in the frontend
      },
    });

    return NextResponse.json({
      success: true,
      reports: reports.map((r) => ({
        ...r,
        summary: JSON.parse(r.summary),
      })),
    });
  } catch (error) {
    console.error("Fetch report history error:", error);
    return NextResponse.json({ error: "Failed to fetch report history" }, { status: 500 });
  }
}
