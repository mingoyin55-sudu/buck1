import { GoogleGenAI } from "@google/genai";
import { BuckParams, CalculationResults } from "../types";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDesignWithGemini = async (
  params: BuckParams,
  results: CalculationResults
): Promise<string> => {
  try {
    const prompt = `
      You are a senior power electronics engineer. Review the following Buck Converter design and provide a concise technical analysis.
      
      Design Parameters:
      - Input: ${params.vin}V
      - Output: ${params.vout}V @ ${params.iout}A
      - Switching Freq: ${params.fsw}kHz
      - Inductor: ${params.l}uH (DCR: ${params.dcr}mOhm)
      - MOSFET Rds(on): ${params.rdsOn}mOhm
      
      Calculated Results:
      - Mode: ${results.mode}
      - Efficiency: ${results.efficiency.toFixed(2)}%
      - Duty Cycle: ${(results.dutyCycle * 100).toFixed(1)}%
      - Inductor Ripple: ${results.rippleCurrent.toFixed(2)}A
      - Peak Current: ${results.peakCurrent.toFixed(2)}A
      - Total Loss: ${results.losses.total.toFixed(2)}W
      
      Please provide:
      1. An assessment of the component selection (is the inductor value appropriate? is the frequency too high/low?).
      2. Comments on the efficiency and dominant loss factor.
      3. A warning if the design pushes boundaries (e.g., high ripple, DCM vs CCM suitability).
      4. One actionable recommendation to improve performance.
      
      Keep the response professional, structured, and under 200 words. Format with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate analysis at this time. Please check your API key or network connection.";
  }
};
