import { Metadata } from 'next';
import AdminLayout from './layout';

export const metadata: Metadata = {
  title: 'MN168 - Admin',
  description: 'Chinese and Thai cargo services - Admin Section',
};

const AdminPage = () => {
  return (
    <AdminLayout>
      <h1>Admin Page Content</h1>
    </AdminLayout>
  );
};

export default AdminPage;
