import BasicLayout from '@/components/layout/BasicLayout';
import UsersGrid from '@/components/users/UsersGrid';
import { getUsers } from '@/lib/actions/users';

export const metadata = { title: 'Users' };

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <BasicLayout fluid={undefined}>
      <div aria-label="Users" style={{ padding: '24px 0' }}>
        <h3 style={{ marginBottom: 24, fontWeight: 600 }}>Users</h3>

        <UsersGrid users={users} />
      </div>
    </BasicLayout>
  );
}
