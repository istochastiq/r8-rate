const LABEL_MAP = {
  'influencers': 'Influencers',
  'account': 'Account',
  'threads': 'Threads'
};

function humanize(segment) {
  if (!segment) return '';
  const decoded = decodeURIComponent(segment);
  if (LABEL_MAP[decoded]) return LABEL_MAP[decoded];
  // Capitalize first letter; keep handles like @mert as-is
  if (decoded.startsWith('@')) return decoded;
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

export function buildBreadcrumbs(pathname) {
  const path = (pathname || '/').split('?')[0];
  const parts = path.split('/').filter(Boolean);

  const items = [];
  let acc = '';
  for (const part of parts) {
    acc += '/' + part;
    items.push({ label: humanize(part), href: acc });
  }
  // root case
  if (items.length === 0) {
    return [{ label: 'Home', href: '/' }];
  }
  return items;
}


