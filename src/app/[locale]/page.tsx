export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <main className="main">{children}</main>
    </div>
  );
}
