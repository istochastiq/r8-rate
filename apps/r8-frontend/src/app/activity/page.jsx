'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

function formatTs(ms) {
  try { return new Date(ms).toLocaleString(); } catch { return ''; }
}

export default function ActivityPage() {
  const { ready, user } = usePrivy();
  const { wallets } = useWallets();
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.id.split(':')[2];

  async function loadPage(nextCursor) {
    if (!userId || !ready) return;
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams();
      qs.set('user', userId);
      if (nextCursor) qs.set('cursor', nextCursor);
      qs.set('limit', '100');
      const resp = await fetch(`/api/activity?${qs.toString()}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to load');
      setItems(data.transactions || []);
      setCursor(data.next_cursor || null);
    } catch (e) {
      setError('Failed to fetch activity');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ready) {
      if (userId) {
        loadPage();
      } else {
        setLoading(false);
        setItems([]);
      }
    }
  }, [userId, ready]);

  return (
    <main className="space-y-4">
      <h1 className="text-lg font-semibold tracking-tight">Activity</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Asset</th>
              <th className="px-3 py-2 text-left font-medium">Amount</th>
              <th className="px-3 py-2 text-left font-medium">From → To</th>
              <th className="px-3 py-2 text-left font-medium">Hash</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No activity</td></tr>
            )}
            {!loading && items.map((tx) => {
              const d = tx.details || {};
              const amount = d?.display_values?.eth || (d?.raw_value && d?.raw_value_decimals ? (Number(d.raw_value) / Math.pow(10, d.raw_value_decimals)).toString() : '');
              return (
                <tr key={tx.transaction_hash} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-gray-700">{formatTs(tx.created_at)}</td>
                  <td className="px-3 py-2 text-gray-700">{d.type || '—'}</td>
                  <td className="px-3 py-2 text-gray-700">{d.asset?.toUpperCase?.() || '—'}</td>
                  <td className="px-3 py-2 text-gray-900 font-medium">{amount || '—'}</td>
                  <td className="px-3 py-2 text-gray-700">
                    {(d.sender?.slice?.(0,6) || '—')} → {(d.recipient?.slice?.(0,6) || '—')}
                  </td>
                  <td className="px-3 py-2 text-blue-600">
                    {tx.transaction_hash ? (
                      <a href={`https://basescan.org/tx/${tx.transaction_hash}`} target="_blank" rel="noreferrer">{tx.transaction_hash.slice(0,10)}…</a>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => loadPage()} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Refresh</button>
        <button onClick={() => cursor && loadPage(cursor)} disabled={!cursor} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>
    </main>
  );
}


