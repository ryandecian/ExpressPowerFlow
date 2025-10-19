import express from "express";
import path from "path";
import { createMqttBroker_Broker } from "./createMqttBroker.broker.js";

const app = express();
app.use(express.json());

// Démarre le broker au lancement (selon la config JSON)
const broker = createMqttBroker_Broker(path.resolve(__dirname, "../config/mqtt.config.json"));
broker.start();

/** Health */
app.get("/health", (_req, res) => {
    return res.json({ ok: true, mqtt: broker.status() });
});

/** Admin minimal (pour dev) */
app.post("/admin/mqtt/reload", (_req, res) => {
    broker.reload();
    return res.json({ ok: true });
});

app.post("/admin/mqtt/stop", (_req, res) => {
    broker.stop();
    return res.json({ ok: true });
});

app.post("/admin/mqtt/start", (_req, res) => {
    broker.start();
    return res.json({ ok: true });
});

const PORT = process.env.PORT || 7080;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
