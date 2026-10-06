import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Please provide a question."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: question
        });

        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "Something went wrong while asking Gemini."
        });
    }
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(
            `🚀 StudyForge is running at http://localhost:${PORT}`
        );
    });
}

export default app;