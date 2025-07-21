import Redis from "ioredis";

const redis = new Redis();

redis.on("ready", async () => {
    console.log("✅ Conectado ao Redis com sucesso!");
});

redis.on("error", (err) => {
    console.error("❌ Erro ao conectar ao Redis:", err);
});

export default redis;
