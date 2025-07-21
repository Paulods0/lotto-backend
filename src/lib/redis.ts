import Redis from "ioredis";

const redis = new Redis({
    host: "172.17.198.67",
    port: 6379,
    password: "msftsrep0."
});

redis.on("ready", async () => {
    console.log("✅ Conectado ao Redis com sucesso!");
});

redis.on("error", (err) => {
    console.error("❌ Erro ao conectar ao Redis:", err);
});

export default redis;
