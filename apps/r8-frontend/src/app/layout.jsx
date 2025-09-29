import './globals.css';
import AppProviders from '../components/AppProviders';
import ClientHeader from '../components/ClientHeader';

export const metadata = {
  title: 'R8-rate',
  description: 'Experimental market for competitive ratings'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <AppProviders>
          <ClientHeader />
          <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}



