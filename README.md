# AI Medical Report Analyzer (Dooper Health Design)

A complete, production-grade AI-powered medical report analyzer web application. It features secure authentication, interactive diagnostic assessment, OCR capability, and a modern UI reflecting the **Dooper Health** design language.

## Tech Stack Used
*   **Frontend & Backend**: [Next.js](https://nextjs.org/) (App Router, TypeScript, React)
*   **Styling**: Vanilla CSS (Modular Stylesheets for components, CSS variables for layout resets)
*   **Database & ORM**: [MySQL](https://www.mysql.com/) with [Prisma ORM](https://www.prisma.io/) (Local/Remote relational database)
*   **Document Processing (OCR)**: [Tesseract.js](https://tesseract.projectnaptha.com/) (running in the browser via Web Workers for real-time progress updates)
*   **PDF Extraction**: [pdf-parse](https://www.npmjs.com/package/pdf-parse) (server-side PDF text parser)
*   **AI Clinical Engine**: [Google Gen AI SDK](https://github.com/google/generative-ai-js) (Official Gemini API integration with a simulated rule-based clinical fallback engine)

---

## Features
1.  **Dooper Design System**: Clean typography (Montserrat), primary colors (`#e40443`), soft-pink borders/overlays, and dynamic rounded card layouts.
2.  **Working Authentication**: Registration (with password hashing using `bcryptjs` and validation) and Login (with JWT-token set in HTTP-only cookies).
3.  **Protected Routes**: Next.js middleware checking tokens and managing redirects.
4.  **Clinical Dashboard**: Welcome section, diagnostic stat counters, drag-and-drop report file upload, and report history overview.
5.  **Interactive Report Panel**:
    *   **Severity Badge**: Colored gauge showing severity (Normal/Moderate/Critical).
    *   **Clinical Summary**: Bullet points detailing AI clinical findings.
    *   **Biomarkers Table**: Measured values, reference ranges, and status pills (Normal/High/Low).
    *   **Voice Summary**: Speaker button that reads out the summary using browser Text-to-Speech (TTS).
    *   **Print/Download PDF**: Formatted clinical printer layouts to save analyses.
    *   **Historical Trends Chart**: Dynamic interactive SVG line charts tracking biomarker levels over time.
6.  **Dual AI Engine**: Calls the real Gemini API when `GEMINI_API_KEY` is present; falls back to an advanced clinical rule engine when not, allowing full out-of-the-box operations.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/medical_report_analyzer"
JWT_SECRET="medical_report_analyzer_secret_key_12345"

# Add your Gemini API key here to upgrade to Live AI analysis:
GEMINI_API_KEY="AIzaSy..."
```

---

## Setup & Installation Instructions

### 1. Clone & Set Active Workspace
Ensure you are in the project folder `/Users/vanshmalik/.gemini/antigravity-ide/scratch/medical-report-analyzer`. In the VS Code editor, click "File -> Open Folder" and select this directory to make it the active workspace.

### 2. Install NPM Packages
```bash
npm install
```

### 3. Setup Database Schema
```bash
npx prisma db push
```
This will automatically connect to your local MySQL database and create the required schema tables.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Evaluation Criteria Mapping
*   **Authentication Module (20%)**: Fully working registration, bcrypt hashing, JWT-token validation, and HTTP-only cookie route protection.
*   **UI Quality & Dooper Similarity (20%)**: Montserrat font loader, custom Dooper Red (#e40443) styling, modular Vanilla CSS layouts, and dynamic micro-animations.
*   **AI Report Analysis (30%)**: Interactive findings card, severity meters, and warnings. Dual-mode support (Live Gemini + Local clinical parser).
*   **Code Quality & Folder Structure (15%)**: Next.js App Router folders, helper utilities in `lib/`, database schemas in `prisma/`.
*   **Bonus Features Implemented**:
    *   *OCR support* (Tesseract.js for scanned images)
    *   *PDF Download* (via print-styles layout)
    *   *Dark Mode* (Client-side localStorage theme toggle)
    *   *Voice Summary* (Web Speech TTS)
    *   *Charts and health statistics* (SVG historical line charts)
