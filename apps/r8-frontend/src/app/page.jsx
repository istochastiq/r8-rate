import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">R8‑rate</h1>
      <p className="text-sm text-gray-600">Clean start. Simple home page.</p>

      <nav className="pt-4 border-t border-gray-100">
        <ul className="space-y-2">
          <li><Link href="/activity" className="text-blue-600 hover:underline">View Activity</Link></li>
        </ul>
      </nav>
    </main>
  );
}
