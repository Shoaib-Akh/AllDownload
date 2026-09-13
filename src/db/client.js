/**
 * D1 Database Client
 *
 * In Cloudflare Workers/Pages, the D1 binding is available via
 * the `env` object passed to the request handler.
 *
 * Usage in API routes:
 *   export async function GET(request, { env }) {
 *     const db = getDB(env);
 *     const results = await db.prepare("SELECT * FROM platforms").all();
 *     return Response.json(results);
 *   }
 */

export function getDB(env) {
  if (!env?.DB) {
    console.warn("D1 database binding not available. Using mock.");
    return createMockDB();
  }
  return env.DB;
}

function createMockDB() {
  return {
    prepare: (sql) => ({
      bind: (...params) => ({
        all: async () => ({ results: [] }),
        first: async () => null,
        run: async () => ({ success: true }),
      }),
      all: async () => ({ results: [] }),
      first: async () => null,
      run: async () => ({ success: true }),
    }),
    batch: async (statements) => statements.map(() => ({ results: [] })),
    exec: async (sql) => ({ count: 0 }),
  };
}
