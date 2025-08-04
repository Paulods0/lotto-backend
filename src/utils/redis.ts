import redis from '../lib/redis';

/**
 * Seta um valor no Redis com expiração
 */
export async function setCache<T>(key: string, value: T, seconds = 60 * 5): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', seconds);
  } catch (error) {
    console.error(`Erro ao setar cache [${key}] no Redis:`, error);
  }
}

/**
 * Obter os dados do Redis
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Erro ao fazer parse do cache da chave "${key}":`, error);
    return null;
  }
}

/**
 * Deleta todas as chaves no Redis que casam com o padrão fornecido
 */
export async function deleteCache(pattern: string): Promise<void> {
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (error) {
    console.error(`Erro ao fazer scan e deletar chaves com padrão [${pattern}]:`, error);
  }
}
