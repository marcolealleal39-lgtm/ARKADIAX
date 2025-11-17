import express from "express";
import { verifyKey } from "discord-interactions";

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post("/interactions", (req, res) => {
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  const isValid = verifyKey(
    req.rawBody,
    signature,
    timestamp,
    process.env.PUBLIC_KEY
  );

  if (!isValid) {
    return res.status(401).send("invalid request signature");
  }

  if (req.body.type === 1) {
    return res.send({ type: 1 }); // PING OK
  }

  return res.send({
    type: 4,
    data: { content: "¡Hola Marco! Tu bot ya está funcionando 🚀" }
  });
});

app.listen(3000, () => console.log("Bot ready on port 3000"));
