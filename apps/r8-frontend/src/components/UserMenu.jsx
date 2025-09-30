'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrivy, useFundWallet, useWallets, useSendTransaction, getEmbeddedConnectedWallet } from '@privy-io/react-auth';
import { createPublicClient, http, formatEther, parseEther, isAddress, getAddress as toChecksum } from 'viem';
import { base } from 'viem/chains';

function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(event) {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [ref, handler]);
}

function truncateAddress(address) {
  if (!address) return '';
  return address.slice(0, 6) + '…' + address.slice(-4);
}

// Using Privy's useWalletBalance hook instead of manual viem client

export default function UserMenu() {
  const { user, logout, ready } = usePrivy();
  const { wallets } = useWallets();
  const [open, setOpen] = useState(false);
  const [balanceWei, setBalanceWei] = useState();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amountEth, setAmountEth] = useState('0.0000');
  const [withdrawError, setWithdrawError] = useState('');
  const menuRef = useRef(null);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const { fundWallet } = useFundWallet();
  const { sendTransaction } = useSendTransaction();

  useClickOutside(menuRef, () => setOpen(false));

  const address = useMemo(() => {
    const evm = wallets?.find?.(w => w.chainType === 'ethereum' && w.address)?.address;
    const linked = user?.linkedAccounts?.find?.(a => a.type === 'wallet' && a.chainType === 'ethereum')?.address;
    return evm || linked || user?.wallet?.address || user?.address;
  }, [wallets, user]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!ready || !address) return;
      try {
        const client = createPublicClient({ chain: base, transport: http() });
        const bal = await client.getBalance({ address });
        if (!cancelled) setBalanceWei(bal);
      } catch (_) {}
    }
    load();
    return () => { cancelled = true; };
  }, [ready, address]);

  // Helpers for amount editing at 4 decimal precision (0.0001 ETH steps)
  const WEI_PER_STEP = 100000000000000n; // 1e14 wei = 0.0001 ETH
  const unitsAvailable = balanceWei ? (balanceWei / WEI_PER_STEP) : 0n; // in 0.0001 ETH units
  function parseUnits4(str) {
    if (!str) return 0n;
    const cleaned = String(str).replace(/[^0-9.]/g, '');
    if (!cleaned) return 0n;
    const parts = cleaned.split('.');
    const intPart = parts[0] || '0';
    const fracPart = (parts[1] || '').padEnd(4, '0').slice(0, 4);
    try {
      const intUnits = BigInt(intPart) * 10000n;
      const fracUnits = BigInt(fracPart || '0');
      return intUnits + fracUnits;
    } catch {
      return 0n;
    }
  }
  function unitsToString4(units) {
    if (units < 0n) units = 0n;
    const intUnits = units / 10000n;
    const fracUnits = units % 10000n;
    const fracStr = fracUnits.toString().padStart(4, '0');
    return `${intUnits.toString()}.${fracStr}`;
  }
  function clampUnits(units) {
    if (units < 0n) return 0n;
    if (units > unitsAvailable) return unitsAvailable;
    return units;
  }
  function setAmountUnits(units) {
    const clamped = clampUnits(units);
    setAmountEth(unitsToString4(clamped));
  }

  const currentUnits = clampUnits(parseUnits4(amountEth));
  const q25 = unitsAvailable / 4n;
  const q50 = unitsAvailable / 2n;
  const q75 = (unitsAvailable * 3n) / 4n;
  const q100 = unitsAvailable;
  const pctLinkBase = "text-[11px] transition-colors rounded px-2 py-0.5";
  const selectedCls = "bg-gray-900 text-white";
  const idleCls = "text-gray-700 hover:bg-gray-100";

  if (!appId || appId === 'undefined' || appId === '') return null;

  const initial = (user?.email?.address || user?.email || user?.name || address || 'U').toString().trim()[0]?.toUpperCase?.() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
          {initial}
        </span>
        <span className="hidden sm:inline text-gray-700">Account</span>
        <svg className="h-3 w-3 text-gray-500" viewBox="0 0 12 12" fill="none"><path d="M3 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Balance section */}
          <div className="px-3 py-2">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Balance</div>
            <div className="flex items-baseline justify-between">
              <div className="text-sm text-gray-700">ETH</div>
              <div className="text-sm font-semibold text-gray-900">
                {balanceWei === undefined || balanceWei === null ? '—' : Number(formatEther(balanceWei)).toFixed(4)}
              </div>
            </div>
            {address && (
              <div className="mt-1 text-[11px] text-gray-500">{truncateAddress(address)} · Base</div>
            )}
              <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={async () => {
                  if (!ready) { setWithdrawError('Wallet is initializing'); return; }
                  const evm = wallets || [];
                  // Prefer embedded (privy) ethereum wallet, then any ethereum wallet
                  const embedded = evm.find?.(w => w.chainType === 'ethereum' && w.walletClientType === 'privy' && w.address);
                  const anyEvm = evm.find?.(w => w.chainType === 'ethereum' && w.address);
                  const candidate = embedded?.address
                    || anyEvm?.address
                    || address
                    || user?.linkedAccounts?.find?.(a => a.type === 'wallet' && (a.chainType === 'ethereum' || a.chain_type === 'ethereum'))?.address
                    || user?.linked_accounts?.find?.(a => a.type === 'wallet' && (a.chain_type === 'ethereum' || a.chainType === 'ethereum'))?.address;
                  if (!candidate || !isAddress(candidate)) { setWithdrawError('No wallet address'); return; }
                  let checksum;
                  try { checksum = toChecksum(candidate); } catch { setWithdrawError('Invalid wallet address'); return; }
                  try {
                    // Defer to next microtask to avoid race with renders/providers
                    await Promise.resolve();
                    // Let user pick method in the Privy modal (do not force defaultFundingMethod)
                    await fundWallet({ address: checksum, options: { chain: { id: 8453 } } });
                    const client = createPublicClient({ chain: base, transport: http() });
                    const bal = await client.getBalance({ address: checksum });
                    setBalanceWei(bal);
                  } catch (err) {
                    // surface an error for visibility during debugging
                    console.error('fundWallet failed', { candidate: checksum, wallets, user }, err);
                    setWithdrawError('Funding failed');
                  }
                }}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Deposit
              </button>
              <button
                onClick={() => setShowWithdraw((v) => !v)}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Withdraw
              </button>
            </div>
            {showWithdraw && (
              <div className="mt-2 space-y-2">
                <div className="text-xs text-gray-500">Send on Base</div>
                <input
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value.trim())}
                  placeholder="Recipient (0x...)"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-gray-400"
                />
                <div className="flex items-center gap-2">
                  <input
                    value={amountEth}
                    onChange={(e) => setAmountEth(unitsToString4(clampUnits(parseUnits4(e.target.value))))}
                    placeholder="Amount (ETH)"
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <button
                    onClick={async () => {
                      setWithdrawError('');
                      if (!address) return;
                      if (!isAddress(toAddress)) { setWithdrawError('Invalid address'); return; }
                      const units = clampUnits(parseUnits4(amountEth));
                      if (units <= 0n) { setWithdrawError('Invalid amount'); return; }
                      try {
                        const value = (units * WEI_PER_STEP);
                        await sendTransaction({ to: toAddress, value }, undefined, undefined, address);
                        const client = createPublicClient({ chain: base, transport: http() });
                        const bal = await client.getBalance({ address });
                        setBalanceWei(bal);
                        setShowWithdraw(false);
                        setToAddress('');
                        setAmountEth('0.0000');
                      } catch (err) {
                        setWithdrawError('Failed to send');
                      }
                    }}
                    className="rounded-md bg-black px-3 py-1 text-xs font-medium text-white hover:opacity-90"
                  >
                    Send
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0">
                    <button onClick={() => setAmountUnits(q25)} className={`${pctLinkBase} ${currentUnits===q25 ? selectedCls : idleCls}`}>25%</button>
                    <button onClick={() => setAmountUnits(q50)} className={`${pctLinkBase} ${currentUnits===q50 ? selectedCls : idleCls}`}>50%</button>
                    <button onClick={() => setAmountUnits(q75)} className={`${pctLinkBase} ${currentUnits===q75 ? selectedCls : idleCls}`}>75%</button>
                    <button onClick={() => setAmountUnits(q100)} className={`${pctLinkBase} ${currentUnits===q100 ? selectedCls : idleCls}`}>100%</button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setAmountUnits(clampUnits(parseUnits4(amountEth) - 1n))} className="h-7 w-7 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50">-</button>
                    <button onClick={() => setAmountUnits(clampUnits(parseUnits4(amountEth) + 1n))} className="h-7 w-7 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50">+</button>
                  </div>
                </div>
                {withdrawError && <div className="text-[11px] text-red-600">{withdrawError}</div>}
              </div>
            )}
          </div>
          <div className="my-1 h-px w-full bg-gray-100" />

          {/* Links section */}
          <div className="py-1">
            <a href="/activity" className="block px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50">Activity</a>
            <button className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50">My positions</button>
            <button className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50">Notifications</button>
          </div>

          <div className="my-1 h-px w-full bg-gray-100" />

          {/* Logout */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

 