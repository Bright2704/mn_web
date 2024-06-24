import { Metadata } from 'next';
import UserLayout from './layout';

export const metadata: Metadata = {
  title: 'MN168 - User',
  description: 'Chinese and Thai cargo services - User Section',
};

const UserPage = () => {
  return (
    <UserLayout>
      <h1>User Page Content</h1>
    </UserLayout>
  );
};

export default UserPage;
