import './globals.css';
export const metadata = {
  title: 'R8-rate',
  description: 'Experimental market for competitive ratings'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}



