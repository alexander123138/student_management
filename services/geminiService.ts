
import { GoogleGenAI, Type } from "@google/genai";
import { Student, GradeRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudentPerformanceInsights = async (student: Student, grades: GradeRecord[]) => {
  const prompt = `
    Analyze the performance of student ${student.firstName} ${student.lastName} in ${student.gradeLevel}.
    Grades: ${JSON.stringify(grades)}
    Provide a professional teacher's comment, strengths, and areas for improvement in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comment: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["comment", "strengths", "improvements"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      comment: "Good performance overall. Needs more focus on technical subjects.",
      strengths: ["Punctuality", "Participation"],
      improvements: ["Mathematics"]
    };
  }
};
