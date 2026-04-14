const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// 🔐 PUT YOUR *NEW* TOKEN HERE
const BOT_TOKEN = "8710116298:AAEhiJxK-41lP2y5n1BMYfO4LMH3W8ErBJc";
const CHAT_ID = "1270751128"; // we’ll get this next

app.use(express.static("."));

app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const time = new Date().toLocaleString();
    const subject = req.body.subject;

    // 1️⃣ Send text message
    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: `📩 New Demo Submission
📚 Subject: ${subject}
🌍 IP: ${ip}
🕒 Time: ${time}`
      }
    );

    // 2️⃣ Send photo
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", fs.createReadStream(req.file.path));

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      formData,
      { headers: formData.getHeaders() }
    );

    res.send("Demo completed successfully ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Telegram send failed");
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
