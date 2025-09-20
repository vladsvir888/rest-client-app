import '@/app/globals.css';
import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'REST Client',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
