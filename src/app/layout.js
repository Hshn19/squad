import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import BottomNav from '@/components/BottomNav';
import SplashScreen from '@/components/SplashScreen';

export const metadata = {
  title: 'Squad',
  description: 'Smart budgeting and group savings for Malaysian youth',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6C63FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinWise" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <AppProvider>
          <SplashScreen />
          <div style={{
            display: 'flex', flexDirection: 'column',
            minHeight: '100vh', paddingBottom: 80,
            background: '#F8F9FB',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {children}
            </main>
            <BottomNav />
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