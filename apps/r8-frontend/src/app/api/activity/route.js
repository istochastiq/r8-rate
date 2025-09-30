export const runtime = 'nodejs';

function json(data, init = 200) {
  return new Response(JSON.stringify(data), {
    status: typeof init === 'number' ? init : 200,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) }
  });
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user');
    const cursor = url.searchParams.get('cursor') || undefined;
    const limit = url.searchParams.get('limit') || '100';
    if (!userId) return json({ error: 'user is required' }, 400);

    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const appSecret = process.env.PRIVY_APP_SECRET;
    if (!appId || !appSecret) return json({ error: 'Privy credentials are missing' }, 500);

    const basic = btoa(`${appId}:${appSecret}`);
    let walletId = null;

    // Resolve wallet id if userId was provided
    if (/^[a-z0-9]+$/.test(userId)) {
      const wresp = await fetch(`https://api.privy.io/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basic}`,
          'privy-app-id': appId
        }
      });
      if (!wresp.ok) {
        const msg = await wresp.text().catch(() => '');
        console.error('Privy users fetch failed', wresp.status, msg);
      } else {
        const wjson = await wresp.json().catch(() => ({}));
        walletId = wjson.linked_accounts?.find(a => a.type === 'wallet' && a.chain_type === 'ethereum')?.id;
      }
    }
    
    if (!walletId) return json({ error: 'Wallet not found' }, 404);

    const qs = new URLSearchParams();
    qs.set('chain', 'base');
    qs.set('asset', 'eth');
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(Math.min(100, Number(limit) || 100)));

    const resp = await fetch(`https://api.privy.io/v1/wallets/${encodeURIComponent(walletId)}/transactions?${qs.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basic}`,
        'privy-app-id': appId
      }
    });
    if (!resp.ok) {
      const text = await resp.text();
      console.error('Privy tx fetch failed', resp.status, text);
      return json({ error: 'Upstream error', details: text }, resp.status);
    }
    const data = await resp.json();
    return json(data, 200);
  } catch (e) {
    console.error('Activity API error', e);
    return json({ error: 'Unexpected error' }, 500);
  }
}


