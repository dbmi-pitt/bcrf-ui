import BasicLayout from '@/components/layout/BasicLayout';
import { logInWithGlobus } from '@/lib/auth/actions';
import ENVS from '@/lib/envs';
import { Alert, Button, Container } from 'react-bootstrap';

export const metadata = { title: 'Login' };

export default async function LogIn({ searchParams }) {
  const params = await searchParams;
  const from = typeof params?.from === 'string' ? params.from : '';

  return (
    <BasicLayout>
      <Container className="container--alert">
        <Alert variant="light">
          <div className="alert-heading h4">{ENVS.app.name}</div>
          <p>
            User authentication is required to search the data hub. Please click
            the button below and you will be redirected to a Globus page to
            select your institution. After selecting your institution, you will
            be redirected to your institutional login page to enter your
            credentials.
          </p>
          <hr />
          <form action={logInWithGlobus}>
            <input type="hidden" name="from" value={from} />
            <Button type="submit">Log in with Globus</Button>
          </form>
        </Alert>
      </Container>
    </BasicLayout>
  );
}
