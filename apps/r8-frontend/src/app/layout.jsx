export const metadata = {
  title: 'R8-rate',
  description: 'Experimental market for competitive ratings'
};

import './globals.css';
import Providers from '../components/Providers';
import GlobalHeader from '../components/GlobalHeader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <GlobalHeader />
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
