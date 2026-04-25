const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Mets ton webhook Discord ici
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1497645236678295654/LzO8Lm8B1YtIx21ZljbruohjHC9wKDV0Ay9GotyqbTddM9miQsmu66dxAA47vRQZDxDK";

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post("/verify", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"] || "Inconnu";
  const now = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  console.log(`Connexion — IP: ${ip} — ${now}`);

  const body = JSON.stringify({
    embeds: [{
      title: "🔐 Nouvelle tentative de connexion",
      color: 0x5865f2,
      fields: [
        { name: "🌐 Adresse IP", value: `\`${ip}\``, inline: true },
        { name: "🕒 Heure",      value: now,         inline: true },
        { name: "💻 Navigateur", value: userAgent,   inline: false },
      ],
      footer: { text: "Système de sécurité — Serveur GTA" },
    }],
  });

  try {
    // fetch natif Node.js 18+ (pas besoin de node-fetch)
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      console.error("Erreur webhook:", response.status, await response.text());
      return res.json({ success: false });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Erreur fetch:", err.message);
    return res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
