import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
      <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        <li><Link href="/">Home</Link></li>
        <li>/</li>
        <li aria-current="page">Influencers</li>
      </ol>
    </nav>
  );
}

export default async function Page() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/influencers?select=*&order=created_at.desc`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <Breadcrumbs />
        <h1>Influencers</h1>
        <p style={{ color: 'crimson' }}>Error: {res.status} {res.statusText}</p>
      </main>
    );
  }
  const data = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <Breadcrumbs />
      <h1>Influencers</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e5e5' }}>
              <th style={{ padding: '8px 6px' }}>Avatar</th>
              <th style={{ padding: '8px 6px' }}>Handle</th>
              <th style={{ padding: '8px 6px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                <td style={{ padding: '8px 6px' }}>
                  {row.twitter_profile_pic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.twitter_profile_pic} alt={row.twitter_handle} width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 8 }} />
                  )}
                </td>
                <td style={{ padding: '8px 6px', fontWeight: 600 }}>
                  <Link href={`/influencers/${encodeURIComponent(row.twitter_handle)}`}>@{row.twitter_handle}</Link>
                </td>
                <td style={{ padding: '8px 6px', color: '#666' }}>
                  {row.created_at ? new Date(row.created_at).toLocaleString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


