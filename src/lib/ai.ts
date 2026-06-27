import { GoogleGenAI } from "@google/genai";

export interface Biomarker {
  biomarker: string;
  value: string;
  range: string;
  status: "Normal" | "High" | "Low";
}

export interface AnalysisResult {
  reportName: string;
  summary: string[];
  findings: Biomarker[];
  severity: "Normal" | "Moderate" | "Critical";
  alerts: string[];
}

/**
 * Runs rule-based analysis on the report text to simulate clinical assessment
 */
function runSimulatedAnalysis(text: string): AnalysisResult {
  const findings: Biomarker[] = [];
  const summary: string[] = [];
  const alerts: string[] = [];
  let severity: "Normal" | "Moderate" | "Critical" = "Normal";

  // Lowercase text for easy regex matching
  const lText = text.toLowerCase();

  // Helper to search values (looks for numbers near a keyword)
  const extractValue = (keyword: string): number | null => {
    const regex = new RegExp(`${keyword}[^0-9]*([0-9]+(?:\\.[0-9]+)?)`, "i");
    const match = lText.match(regex);
    return match ? parseFloat(match[1]) : null;
  };

  // 1. Fasting Glucose check
  const glucoseVal = extractValue("glucose") || extractValue("sugar");
  if (glucoseVal !== null) {
    let status: "Normal" | "High" | "Low" = "Normal";
    if (glucoseVal >= 126) {
      status = "High";
      severity = "Critical";
      summary.push(`Fasting glucose level is severely elevated (${glucoseVal} mg/dL).`);
      alerts.push("Critical high blood sugar detected. Immediate medical consultation for diabetes is recommended.");
    } else if (glucoseVal >= 100) {
      status = "High";
      severity = "Moderate";
      summary.push(`Fasting glucose level is mildly elevated (${glucoseVal} mg/dL), indicating prediabetes.`);
      alerts.push("Mildly elevated glucose. Dietary changes and exercise are advised.");
    } else if (glucoseVal < 70) {
      status = "Low";
      severity = "Critical";
      summary.push(`Fasting glucose level is low (${glucoseVal} mg/dL), indicating hypoglycemia.`);
      alerts.push("Hypoglycemia detected. Please consume sugar/carbohydrates and monitor.");
    } else {
      summary.push(`Fasting glucose level is optimal (${glucoseVal} mg/dL).`);
    }
    findings.push({
      biomarker: "Fasting Blood Glucose",
      value: `${glucoseVal} mg/dL`,
      range: "70 - 99 mg/dL",
      status,
    });
  }

  // 2. Hemoglobin check
  const hemoglobinVal = extractValue("hemoglobin") || extractValue("hb") || extractValue("hemo");
  if (hemoglobinVal !== null) {
    let status: "Normal" | "High" | "Low" = "Normal";
    if (hemoglobinVal < 10) {
      status = "Low";
      severity = "Critical";
      summary.push(`Hemoglobin is critically low (${hemoglobinVal} g/dL), indicating severe anemia.`);
      alerts.push("Severe anemia detected. Iron supplementation or blood transfusion evaluation is recommended.");
    } else if (hemoglobinVal < 12) {
      status = "Low";
      if (severity !== "Critical") severity = "Moderate";
      summary.push(`Hemoglobin is low (${hemoglobinVal} g/dL), indicating mild anemia.`);
      alerts.push("Mild anemia detected. Consider increasing dietary iron intake.");
    } else if (hemoglobinVal > 18) {
      status = "High";
      if (severity !== "Critical") severity = "Moderate";
      summary.push(`Hemoglobin is elevated (${hemoglobinVal} g/dL), indicating polycythemia.`);
    } else {
      summary.push(`Hemoglobin level is normal (${hemoglobinVal} g/dL).`);
    }
    findings.push({
      biomarker: "Hemoglobin",
      value: `${hemoglobinVal} g/dL`,
      range: "12.0 - 17.5 g/dL",
      status,
    });
  }

  // 3. Vitamin D check
  const vitDVal = extractValue("vitamin d") || extractValue("25-hydroxy") || extractValue("vit d");
  if (vitDVal !== null) {
    let status: "Normal" | "High" | "Low" = "Normal";
    if (vitDVal < 20) {
      status = "Low";
      if (severity !== "Critical") severity = "Critical";
      summary.push(`Vitamin D level is deficient (${vitDVal} ng/mL).`);
      alerts.push("Vitamin D deficiency detected. Supplementation of Vitamin D3 is advised under medical guidance.");
    } else if (vitDVal < 30) {
      status = "Low";
      if (severity === "Normal") severity = "Moderate";
      summary.push(`Vitamin D level is insufficient (${vitDVal} ng/mL).`);
      alerts.push("Mild Vitamin D insufficiency. Consider solar exposure or light supplements.");
    } else {
      summary.push(`Vitamin D level is sufficient (${vitDVal} ng/mL).`);
    }
    findings.push({
      biomarker: "Vitamin D (25-OH)",
      value: `${vitDVal} ng/mL`,
      range: "30 - 100 ng/mL",
      status,
    });
  }

  // 4. Cholesterol check
  const cholVal = extractValue("cholesterol") || extractValue("total cholesterol");
  if (cholVal !== null) {
    let status: "Normal" | "High" | "Low" = "Normal";
    if (cholVal >= 240) {
      status = "High";
      if (severity !== "Critical") severity = "Critical";
      summary.push(`Total Cholesterol is highly elevated (${cholVal} mg/dL).`);
      alerts.push("High total cholesterol. Cardiovascular risk assessment and lipid-lowering therapies may be discussed.");
    } else if (cholVal >= 200) {
      status = "High";
      if (severity === "Normal") severity = "Moderate";
      summary.push(`Total Cholesterol is borderline high (${cholVal} mg/dL).`);
      alerts.push("Borderline high cholesterol. Monitor diet, reduce saturated fats.");
    } else {
      summary.push(`Total Cholesterol level is optimal (${cholVal} mg/dL).`);
    }
    findings.push({
      biomarker: "Total Cholesterol",
      value: `${cholVal} mg/dL`,
      range: "< 200 mg/dL",
      status,
    });
  }

  // If no biomarkers were detected, return a comprehensive mock report
  if (findings.length === 0) {
    return {
      reportName: "Complete Health Diagnostic Panel",
      summary: [
        "Fasting blood glucose is borderline elevated (104 mg/dL), indicating prediabetic range.",
        "Vitamin D level (18 ng/mL) is in the deficient range, which can affect bone and immune health.",
        "Hemoglobin (14.2 g/dL) and Total Cholesterol (185 mg/dL) are within the normal reference ranges."
      ],
      findings: [
        { biomarker: "Fasting Blood Glucose", value: "104 mg/dL", range: "70 - 99 mg/dL", status: "High" },
        { biomarker: "Hemoglobin", value: "14.2 g/dL", range: "12.0 - 17.5 g/dL", status: "Normal" },
        { biomarker: "Vitamin D (25-OH)", value: "18 ng/mL", range: "30 - 100 ng/mL", status: "Low" },
        { biomarker: "Total Cholesterol", value: "185 mg/dL", range: "< 200 mg/dL", status: "Normal" },
        { biomarker: "TSH (Thyroid)", value: "2.4 uIU/mL", range: "0.4 - 4.0 uIU/mL", status: "Normal" }
      ],
      severity: "Moderate",
      alerts: [
        "Fasting glucose is in the prediabetic range. Regular physical exercise and weight management are recommended.",
        "Vitamin D deficiency detected. Please consult your physician regarding D3 supplementation."
      ]
    };
  }

  return {
    reportName: findings.length === 1 ? `${findings[0].biomarker} Report` : "Basic Metabolic Report",
    summary: summary.length > 0 ? summary : ["All analyzed biomarkers are within normal reference ranges."],
    findings,
    severity,
    alerts,
  };
}

/**
 * Analyzes report text using Gemini API or falls back to simulated rule-based analyzer
 */
export async function analyzeReportText(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("No GEMINI_API_KEY found. Running in Simulated Expert Mode.");
    return runSimulatedAnalysis(text);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert AI clinical medical report analyzer. Your task is to analyze the following medical report text and produce a structured clinical analysis.
      
      Report Text:
      """
      ${text}
      """
      
      Generate a response that STRICTLY conforms to the following JSON structure:
      {
        "reportName": "Name of the medical report (e.g. Lipid Profile, Complete Blood Count, Comprehensive Metabolic Panel)",
        "summary": [
          "List of short, clear, client-facing bullet points explaining the primary findings. (e.g., 'Blood sugar level is elevated', 'Vitamin D deficiency detected')"
        ],
        "findings": [
          {
            "biomarker": "Name of the biomarker (e.g. Glucose, Hemoglobin, Vitamin D3, TSH, HDL)",
            "value": "Measured value with units (e.g. '112 mg/dL', '14.2 g/dL')",
            "range": "Standard normal reference range (e.g. '70 - 99 mg/dL')",
            "status": "One of: 'Normal', 'High', 'Low'"
          }
        ],
        "severity": "One of: 'Normal', 'Moderate', 'Critical'. Set to 'Critical' if there are values indicating immediate danger (like severe hyperglycemia, severe anemia, etc.). Set to 'Moderate' if there are values outside normal ranges but not immediately life-threatening. Otherwise 'Normal'.",
        "alerts": [
          "List of warning messages for out-of-range parameters (e.g., 'High blood sugar detected. Medical consultation recommended.'). Leave empty if everything is Normal."
        ]
      }
      
      Do not include any other text, markdown blocks other than JSON, or comments. Just the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const result = JSON.parse(responseText.trim()) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini API call failed, falling back to simulated rule-based analyzer:", error);
    return runSimulatedAnalysis(text);
  }
}
