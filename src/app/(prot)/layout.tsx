export const dynamic = 'force-dynamic';

export default async function ProtLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
