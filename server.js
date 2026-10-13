const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint Health Check (Untuk cek apakah server aktif)
app.get('/', (req, res) => {
  res.send('AI Script Generator Backend is Running!');
});

// 1. ENDPOINT: GENERATE KALENDER KONTEN
app.post('/api/generate-calendar', async (req, res) => {
  try {
    const { niche, targetAudience, brandingGoal, tone } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Bertindaklah sebagai Content Strategist media sosial handal.
      Buatkan 7 ide kalender konten berdasarkan profil berikut:
      - Niche/Profesi: ${niche}
      - Target Penonton: ${targetAudience}
      - Tujuan Branding: ${brandingGoal}
      - Gaya Bahasa (Tone): ${tone}

      Format output WAJIB JSON Array persis seperti berikut:
      [
        {
          "day": 1,
          "pillar": "Educational",
          "topic": "Judul Topik Konten Singkat",
          "angle": "Sudut pandang pembahasan singkat"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const jsonOutput = JSON.parse(result.response.text());
    res.status(200).json({ status: "success", data: jsonOutput });

  } catch (error) {
    console.error("Calendar Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. ENDPOINT: GENERATE HOOK & SCRIPT KONTEN
app.post('/api/generate-script', async (req, res) => {
  try {
    const { niche, targetAudience, tone, topic } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Bertindaklah sebagai Short-Form Video Scriptwriter (TikTok/Reels/Shorts) profesional.
      Buatkan skrip video pendek lengkap untuk topik: "${topic}"
      Profil: Niche (${niche}), Target Audience (${targetAudience}), Tone (${tone}).

      Format output WAJIB JSON Objek persis seperti berikut:
      {
        "hooks": [
          {"type": "Curiosity Hook", "text": "Kalimat hook memancing penasaran..."},
          {"type": "Problem Hook", "text": "Kalimat hook menembus masalah..."},
          {"type": "Pattern Interrupt", "text": "Kalimat hook bikin penonton stop scrolling..."}
        ],
        "bodyScript": [
          {"visual": "[Visual: Tunjukkan produk / Teks besar di layar]", "narration": "Kalimat narasi bagian 1..."},
          {"visual": "[Visual: Gestur penekanan poin]", "narration": "Kalimat narasi bagian 2..."}
        ],
        "callToAction": [
          {"type": "Engagement", "text": "Komen 'MAU' di bawah!"},
          {"type": "Conversion", "text": "Klik link di bio sekarang!"}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const jsonOutput = JSON.parse(result.response.text());
    res.status(200).json({ status: "success", data: jsonOutput });

  } catch (error) {
    console.error("Script Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server AI Backend berjalan di port ${PORT}`));
