import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import ClientShell from '@/components/ClientShell';

export const metadata = {
  title: 'Squad',
  description: 'Smart budgeting and group savings for Malaysian youth',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Squad</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a0a3d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Squad" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <AppProvider>
          {/* Outer shell — dark background on desktop */}
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #0d0621 0%, #1a0a3d 50%, #0d0621 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
            <ClientShell>{children}</ClientShell>
          </div>
        </AppProvider>

        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </body>
    </html>
  );
}