import { createRequire } from "module";
import { createWorker } from "tesseract.js";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

/**
 * Extracts text from a PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let parser;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || "";
  } catch (error) {
    console.error("PDF text extraction error:", error);
    throw new Error("Failed to extract text from PDF file");
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (err) {
        console.error("Failed to destroy PDFParse instance:", err);
      }
    }
  }
}

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  throw new Error("Server-side image OCR is not supported. Please use the browser client-side OCR upload.");
}

/**
 * Automatically detects file type and extracts text
 */
export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
  const normalizedType = fileType.toLowerCase();
  
  if (normalizedType.includes("pdf")) {
    return extractTextFromPDF(buffer);
  } else if (
    normalizedType.includes("image") ||
    normalizedType.includes("png") ||
    normalizedType.includes("jpg") ||
    normalizedType.includes("jpeg")
  ) {
    return extractTextFromImage(buffer);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}
