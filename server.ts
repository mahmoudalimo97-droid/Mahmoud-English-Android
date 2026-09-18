import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 25mb limit for camera pictures
app.use(express.json({ limit: "25mb" }));

// Lazy Google GenAI initialization helper
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Mahmoud English",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Analyze Image (Camera Snapshot or Upload)
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { image, additionalPrompt } = req.body;
    if (!image) {
      return res.status(400).json({ error: "الصورة مطلوبة للتحليل" });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({
        error: "مفتاح Gemini API غير مهيأ. يرجى التأكد من إضافة المفتاح في لوحة الإعدادات.",
      });
    }

    // Extract base64 data and mimeType
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (image.startsWith("data:")) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    const promptText = `
أنت المعلم الذكي ومحلل الصور المتقدم في تطبيق "Mahmoud English" (محمود إنجلش).
المهمة: قم بتحليل الصورة المرفقة بالكامل تحليلاً لغوياً تعليمياً دقيقاً وشاملاً لمساعدة متعلم اللغة الإنجليزية العربي.
${additionalPrompt ? `طلب إضافي من المستخدم: ${additionalPrompt}` : ""}

المطلوب بدقة:
1. تعرف على العناصر والأشياء الموجودة بالصورة وترجمها بدقة. مثلاً لو في الصورة باب، اذكر Door = باب، لو طاولة Table = طاولة، لو شخص، لو نافذة، لو شجرة، إلخ.
2. إذا كان هناك نص مكتوب بالإنجليزية أو العربية في الصورة (مثل لافتة، كتاب، شاشة، ملصق)، استخرجه بالكامل وترجمه واشرح معناه.
3. لكل عنصر مكتشف:
   - اسمه بالإنجليزية (english)
   - معناه بالعربية (arabic)
   - النطق الصوتي التقريبي بالحروف (phonetic)
   - نوع الكلمة (noun, verb, adjective...)
   - جملة مثال بسيطة بالإنجليزية (exampleSentenceEn)
   - ترجمة جملة المثال بالعربية (exampleSentenceAr)
4. المشهد العام (mainScene): ملخص للمشهد بالإنجليزية والعربية.
5. نصيحة تعليمية ذهبية باللغة العربية (learningTip): نصيحة شيقة ومفيدة تتعلق بالكلمات أو المواقف الموجودة في الصورة.
6. كلمات إضافية مرتبطة بالمشهد (relatedWords): 3 كلمات إضافية مفيدة للتعلم في هذا السياق.

أرجع النتيجة بصيغة JSON حصراً بهذا المخطط:
{
  "mainScene": {
    "english": "A modern wooden door in a cozy room",
    "arabic": "باب خشبي حديث في غرفة مريحة"
  },
  "detectedObjects": [
    {
      "english": "Door",
      "arabic": "باب",
      "phonetic": "/dɔːr/",
      "partOfSpeech": "noun",
      "exampleSentenceEn": "Please close the door gently.",
      "exampleSentenceAr": "من فضلك أغلق الباب برفق."
    }
  ],
  "extractedText": [
    {
      "original": "Push / Pull",
      "translated": "ادفع / اسحب",
      "context": "لافتة شائعة على الأبواب"
    }
  ],
  "learningTip": "نصيحة تعليمية باللغة العربية...",
  "relatedWords": [
    { "english": "Handle", "arabic": "مقبض", "phonetic": "/ˈhændl/" },
    { "english": "Key", "arabic": "مفتاح", "phonetic": "/kiː/" },
    { "english": "Lock", "arabic": "قفل", "phonetic": "/lɒk/" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "أنت تطبيق Mahmoud English المتخصص في ترجمة الكاميرا وتعليم اللغة الإنجليزية للمتحدثين بالعربية. إجاباتك دقيقة، مشجعة، وواضحة جداً، وتنسيق JSON سليم دائماً.",
      },
    });

    const rawText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback clean markdown blocks if any
      const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error in analyze-image:", error);
    res.status(500).json({
      error: error?.message || "حدث خطأ أثناء تحليل الصورة بالذكاء الاصطناعي",
    });
  }
});

// AI Chat Tutor ("أستاذ محمود الذكي")
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({
        error: "مفتاح Gemini API غير مهيأ. يرجى التأكد من إضافة المفتاح في لوحة الإعدادات.",
      });
    }

    // Build chat history
    const formattedContents = [];
    if (Array.isArray(messages)) {
      for (const m of messages.slice(-8)) {
        formattedContents.push({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const systemInstruction = `
أنت "أستاذ محمود" (Mahmoud English AI Tutor)، المعلم الشخصي الخبير والودود لتعليم اللغة الإنجليزية للمتحدثين باللغة العربية داخل تطبيق "Mahmoud English".
شخصيتك:
- مشجع وصبور، تشرح بأسلوب سلس وممتع ومريح جداً للقارئ.
- تتحدث باللغة العربية الفصحى المبسطة مع نصوص وأمثلة إنجليزية واضحة.
- إذا كتب المتعلم جملة إنجليزية بها خطأ، صوّبها بلطف واشرح السبب والقاعدة باختصار.
- وضّح النطق الصوتي التقريبي بالحروف إذا سأل عن نطق كلمة.
- أضف دائماً أمثلة عملية من الحياة اليومية.
- نسق إجابتك بنقاط وتنسيق مريح للعين (عناوين، نقاط، خطوط عريضة).
- في نهاية كل رسالة، اقترح سؤالاً أو تدريباً بسيطاً لمواصلة الحديث والممارسة.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text || "عذراً، لم أستطع تكوين الإجابة. هل يمكنك تكرار السؤال؟",
    });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({
      error: error?.message || "حدث خطأ أثناء التواصل مع المعلم الذكي",
    });
  }
});

// Word deep explanation
app.post("/api/gemini/explain-word", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) {
      return res.status(400).json({ error: "الكلمة مطلوبة" });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({
        error: "مفتاح Gemini API غير مهيأ",
      });
    }

    const prompt = `
اشرح الكلمة الإنجليزية التالية للمتعلم العربي في تطبيق Mahmoud English: "${word}"
أرجع JSON فقط:
{
  "word": "${word}",
  "arabic": "الترجمة الدقيقة",
  "phonetic": "الرمز الصوتي والنطق التقريبي بالعربي",
  "partOfSpeech": "نوع الكلمة (اسم / فعل / صفة...)",
  "definitionAr": "تعريف مبسط وممتع بالعربية",
  "examples": [
    { "en": "Example sentence in English", "ar": "ترجمة الجملة بالعربية" }
  ],
  "synonyms": ["مرادف 1", "مرادف 2"],
  "tip": "نصيحة لحفظ وتذكر هذه الكلمة بسهولة"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error in explain-word:", error);
    res.status(500).json({
      error: error?.message || "حدث خطأ أثناء شرح الكلمة",
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mahmoud English Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
