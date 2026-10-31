export async function onRequestGet(context) {
  const { env } = context;
  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS app_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const row = await env.DB.prepare('SELECT data FROM app_state WHERE id = 1').first();
    if (row) {
      return new Response(row.data, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ folders: [], currentFolderId: null, filter: 'all', sort: 'date', expandedLists: {} }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS app_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        data TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      INSERT INTO app_state (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
    `).bind(JSON.stringify(body)).run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
