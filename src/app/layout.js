import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'FinWise',
  description: 'Smart budgeting for Malaysian youth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css"
        />
      </head>
      <body>
        <AppProvider>
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
      </body>
    </html>
  );
}
