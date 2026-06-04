import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client fallback-safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, AI Quiz Generation will fallback gracefully.");
}

// REST API for AI Quiz generation
app.post("/api/generate-quiz", async (req, res) => {
  const { topic, level, count = 15 } = req.body;

  if (!ai) {
    return res.status(200).json({
      success: false,
      error: "Gemini API kaliti sozlanmagan. API kalitini o'rnatish uchun o'ng burchakdagi 'Secrets' bo'limidan foydalanishingiz mumkin. Server hozircha offline variantlarni taklif qiladi.",
    });
  }

  try {
    const prompt = `Ingliz tili haqida maxsus test savollarini tayyorlang. 
Mavzu/Daraja: ${topic || level || "Aralash daraja"}.
Soni: ${count} ta savol.
Qoidalar:
1. Savollar va variantlar Ingliz tilida bo'lsin.
2. Savollar grammatik va madaniy jihatdan to'g'ri bo'lishi kerak.
3. "explanation" maydonida ushbu savolning to'g'ri javobi nega to'g'riligini o'zbek tilida (Uzbek) qisqa va tushunarli qilib yozing (masalan, tarjimasi va grammatik qoidasi).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Siz professional Ingliz tili o'qituvchisi va imtihon tuzuvchisiz. Siz berilgan mavzuga mos, qiziqarli, o'quvchini rivojlantiruvchi test materiallari tayyorlaysiz.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: {
                type: Type.STRING,
                description: "Ingliz tilidagi savol matni. Masalan: 'Which sentence is grammatically correct?'",
              },
              opts: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "Roppa-rosa 4 ta oqilona javob varianti.",
              },
              ans: {
                type: Type.INTEGER,
                description: "To'g'ri javob indexi (0, 1, 2, 3).",
              },
              explanation: {
                type: Type.STRING,
                description: "O'zbek tilida ushbu savol javobining to'liq va oson tushunarli izohi.",
              },
            },
            required: ["q", "opts", "ans", "explanation"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Bo'sh javob qaytdi.");
    }

    const quizData = JSON.parse(text.trim());
    return res.json({
      success: true,
      questions: quizData,
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return res.status(500).json({
      success: false,
      error: "Savollar generatsiyasida xatolik yuz berdi: " + error.message,
    });
  }
});

// App environment routing
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Server startup crash:", err);
});
