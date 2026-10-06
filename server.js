import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

app.use(express.static("."));

app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Please provide a question."
            });
        }

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash-lite",
            input: question
        });

        res.json({
            answer: interaction.output_text
        });
    }
    catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "Something went wrong while asking Gemini."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `🚀 StudyForge is running at http://localhost:${PORT}`
    );
});