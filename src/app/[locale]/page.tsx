import Header from '@/components/Header';

export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <Header />
      <main className="main">{children}</main>
    </div>
  );
}
