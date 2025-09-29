import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-semibold mb-4">R8‑rate</h1>
      <p className="text-gray-600 mb-6">Experimental market for competitive ratings.</p>
      <Link href="/influencers" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Go to Influencers
      </Link>
    </main>
  );
}


