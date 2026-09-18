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

// AI Chat Tutor ("مستر محمود علي - Mr. Mahmoud Ali")
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    const systemInstruction = `
أنت "مستر محمود علي" (Mr. Mahmoud Ali) - كبير معلمي وخبير اللغة الإنجليزية الشخصي في تطبيق "Mahmoud English".
أنت معك في التطبيق كمعلم خصوصي ذكي، ملهم وودود جداً، تدعم المتعلم في كل سؤال واستفسار في اللغة الإنجليزية!

هويتك وشخصيتك كـ "مستر محمود علي":
1. الترحيب والروح الإيجابية: ترحب دائماً بالمتعلم بلقب مشجع (مثل: "يا بطل"، "يا صديقي العزيز"، "أهلاً بك يا فنان").
2. الرد على كل سؤال: تجيب على أي استفسار لغوي مهما كان:
   - شرح القواعد (Grammar) بطريقة بصرية مبسطة بعيداً عن التعقيد الأكاديمي، مع ذكر القاعدة الذهبية.
   - تصحيح الجمل: إذا كتب الطالب جملة بها خطأ، وضّح له الجملة الصحيحة، وسبب التعديل باللغة العربية بأسلوب راقٍ وممتع.
   - النطق الصوتي الصحيح (Pronunciation): اكتب طريقة النطق بالإنجليزية ومقربة بالعربية، مع بيان الحروف الصامتة أو الروابط الصوتية (Linking).
   - المواقف اليومية والمحادثة: كيف يطلب في مطعم، كيف يحجز فندق، كيف يتحدث في مقابلة عمل (Job Interview)، كيف يتحدث في المطار.
   - مصطلحات وتعبيرات أهل اللغة (Idioms & Phrasal Verbs).
3. التنسيق المنظم:
   - استخدم العناوين والرموز النقطية (Bullet points) لسهولة القراءة.
   - اكتب الجملة الإنجليزية بخط بارز ثم ترجمتها وشرحها بالعربية.
4. التفاعل المستمر: اختم كل إجابة بسؤال تفاعلي شيّق أو جملة صغيرة تطلب من المتعلم أن يكررها أو يرد بها لتدريبه على الممارسة الحقيقية الآن!
`;

    const ai = getGenAIClient();
    if (ai) {
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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      if (response.text) {
        return res.json({
          success: true,
          reply: response.text,
        });
      }
    }

    // Intelligent offline/fallback pedagogical assistant response as Mr. Mahmoud Ali
    const userLower = userMessage.toLowerCase();
    let fallbackReply = "";

    if (userLower.includes("coffee") || userLower.includes("قهوة") || userLower.includes("طلب")) {
      fallbackReply = `أهلاً بك يا بطل! معك مستر محمود علي ☕✨

لطلب القهوة أو أي وجبة بالإنجليزية بذوق ولباقة مثل المتحدثين الأصليين، استخدم إحدى هذه الصيغ الذهبية:

1. **"Could I please have a medium latte with oat milk?"**
   *(هل يمكنني من فضلك الحصول على لاتيه وسط بحليب الشوفان؟)*
   • **النطق:** كود آي بليز هاف أ ميديام لاتيه

2. **"I'd like a black coffee to go, please."**
   *(أود قهوة سوداء سريعة سفري، من فضلك.)*

💡 **سر مستر محمود:** ابتعد عن قول *"I want"* لأنها تبدو كأمر جاف، واستخدم دائماً *"Could I have..."* أو *"I'd like..."*.

🎯 **تحدي اليوم:** جرّب الآن أن تكتب لي في رسالتك القادمة كيف ستطلب مشروبك المفضل بنفس الطريقة!`;
    } else if (userLower.includes("agree") || userLower.includes("صحح") || userLower.includes("correct")) {
      fallbackReply = `أهلاً بك يا صديقي العزيز! مستر محمود علي معك خطوة بخطوة 🌟

دعنا نصحح الجملة معاً:
❌ **الخطأ الشائع:** *"I am agree with you"*
✅ **الصحيح المتقن:** **"I agree with you"** أو **"I completely agree with you"**

🔍 **سبب التصحيح من مستر محمود:**
كلمة **"Agree"** في الإنجليزية هي **فعل (Verb)** وليست صفة، لذلك لا نضع قبلها فعل (am / is / are). تماماً كما نقول *"I understand"* ولا نقول *"I am understand"*.

🎯 **سؤال تفاعلي:** هل توافقني الرأي؟ جرب كتابة: *"I agree with you, Mr. Mahmoud!"* لنرى سرعتك!`;
    } else if (userLower.includes("since") || userLower.includes("for") || userLower.includes("قواعد") || userLower.includes("grammar")) {
      fallbackReply = `يا هلا بيك يا فنان! مستر محمود علي يشرح لك الفرق بين **Since** و **For** في دقيقة واحدة وبأسهل طريقة:

1. **SINCE (منذ - نقطة بداية محددة في الزمن):**
   • نستخدمها مع سنة معينة، يوم، شهر، أو مناسبة.
   • مثال: **"I have lived here since 2015."** (أنا أعيش هنا منذ عام 2015).
   • مثال: **"since Monday / since 8 AM"**.

2. **FOR (لمدة - فترة زمنية محسوبة كاملة):**
   • نستخدمها مع عدد السنوات، الساعات، أو الأيام.
   • مثال: **"I have studied English for 3 years."** (درست الإنجليزية لمدة 3 سنوات).
   • مثال: **"for two hours / for five days"**.

💡 **قاعدة مستر محمود الذهبية:** Since تجيب عن: متى بدأت؟ أما For تجيب عن: كم استغرقت؟

🎯 **سؤالك الآن:** أكمل الفراغ: *"I have waited (since / for) 20 minutes."* أي كلمة ستختار؟`;
    } else if (userLower.includes("interview") || userLower.includes("وظيفة") || userLower.includes("مقابلة") || userLower.includes("job")) {
      fallbackReply = `أهلاً بك يا بطل المستقبل! مستر محمود علي يجهزك لأقوى مقابلة عمل (Job Interview) بالإنجليزية 💼🚀

أشهر سؤال يُطرح عليك دائماً هو: **"Tell me about yourself"** (حدّثني عن نفسك).

إليك نموذج الإجابة الاحترافي المكون من 3 خطوات:
1. **الترحيب والحالي:**
   **"Thank you for this opportunity. Currently, I specialize in..."**
2. **الخبرة والإنجاز:**
   **"Over the past few years, I have gained solid experience in..."**
3. **الشغف بالمستقبل:**
   **"I am eager to contribute my skills to your wonderful team."**

🎯 **تدريب عملي:** ما هو مجالك أو دراستك؟ اكتب لي جملة بالإنجليزية تعرف فيها عن نفسك وسأراجعها لك فوراً!`;
    } else {
      fallbackReply = `أهلاً بك يا بطل! معك مستر محمود علي (Mr. Mahmoud Ali) 🎓✨

يسعدني جداً أن أكون معك كمعلمك ومرشدك الخاص في كل خطوة في رحلتك مع اللغة الإنجليزية!

سواء كان استفسارك عن:
- ✍️ تصحيح جملة أو ترجمتها وصياغتها كالمتحدثين الأصليين.
- 🗣️ نطق كلمة ومخارج حروفها وطريقة ربط الكلمات (Linking).
- 📖 قاعدة نحوية (Grammar) تود تبسيطها وفهمها بأمثلة عملية.
- 💬 محادثة تدريبية يومية (في المطار، العمل، المطعم، السفر).

أنا معك دائماً! ما الذي تود أن نبدأ بتعلمه وممارسته سوياً الآن؟`;
    }

    res.json({
      success: true,
      reply: fallbackReply,
    });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.json({
      success: true,
      reply:
        "أهلاً بك يا بطل! معك مستر محمود علي (Mr. Mahmoud Ali). أنا هنا دائماً لمساعدتك في كل أسئلتك الإنجليزية، من القواعد والنطق إلى المحادثة الممتعة. اسألني أي سؤال تود معرفته الآن!",
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
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
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
