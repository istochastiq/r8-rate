import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Breadcrumbs({ handle }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
      <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        <li><Link href="/">Home</Link></li>
        <li>/</li>
        <li><Link href="/influencers">Influencers</Link></li>
        <li>/</li>
        <li aria-current="page">@{handle}</li>
      </ol>
    </nav>
  );
}

export default async function Page({ params }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/influencers?select=*&twitter_handle=eq.${encodeURIComponent(params.handle)}&limit=1`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <Breadcrumbs handle={params.handle} />
        <h1>Influencer</h1>
        <p style={{ color: 'crimson' }}>Error: {res.status} {res.statusText}</p>
      </main>
    );
  }
  const rows = await res.json();
  const data = rows?.[0];
  if (!data) {
    return (
      <main style={{ padding: 24 }}>
        <Breadcrumbs handle={params.handle} />
        <h1>Not found</h1>
        <p>Influencer @{params.handle} not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <Breadcrumbs handle={params.handle} />
      <h1>@{data.twitter_handle}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        {data.twitter_profile_pic ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.twitter_profile_pic} alt={data.twitter_handle} width={80} height={80} style={{ borderRadius: 12, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 80, height: 80, background: '#eee', borderRadius: 12 }} />
        )}
        <div style={{ color: '#666' }}>Created: {data.created_at ? new Date(data.created_at).toLocaleString() : ''}</div>
      </div>
    </main>
  );
}


