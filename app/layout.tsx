import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gideon AI - Your Personal Productivity Assistant',
  description: 'Chat with Gideon AI to organize your day, extract tasks, and track your goals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
} 