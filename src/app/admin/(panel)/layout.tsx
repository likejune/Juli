import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Control Panel — Julia Bunyakova', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login'); // middleware also guards; double-check here
  return (
    <AdminShell email={user.email} mustChangePassword={user.mustChangePassword}>
      {children}
    </AdminShell>
  );
}
