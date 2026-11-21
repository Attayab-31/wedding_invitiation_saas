import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { getAdminSession } from '@/lib/security/admin-auth';

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect('/admin');
  return <AdminLoginForm />;
}
