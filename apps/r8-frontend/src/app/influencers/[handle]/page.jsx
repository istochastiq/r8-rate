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
  const { handle } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/influencers?select=*&twitter_handle=eq.${encodeURIComponent(handle)}&limit=1`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <Breadcrumbs handle={handle} />
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
        <Breadcrumbs handle={handle} />
        <h1>Not found</h1>
        <p>Influencer @{handle} not found.</p>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs handle={handle} />
      <h1 className="text-2xl font-semibold">@{data.twitter_handle}</h1>
      <div className="mt-3 flex items-center gap-4">
        {data.twitter_profile_pic ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.twitter_profile_pic} alt={data.twitter_handle} width={80} height={80} className="rounded-xl object-cover" />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-xl" />
        )}
        <div className="text-gray-500">Created: {data.created_at ? new Date(data.created_at).toLocaleString() : ''}</div>
      </div>
      <div className="mt-4">
        <a
          href={`https://x.com/${encodeURIComponent(data.twitter_handle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          View on X (Twitter)
        </a>
      </div>
    </main>
  );
}


