import BasicLayout from '@/components/layout/BasicLayout';
import { logInWithGlobus } from '@/lib/actions/auth';
import ENVS from '@/lib/envs';
import { Alert, Button, Container } from 'react-bootstrap';

export default function LogIn() {
  return (
    <BasicLayout>
      <Container className='vertically-centered'>
        <Alert>
          <div className="alert-heading h4">{ENVS.app.name}</div>
          <p>
            User authentication is required to search the dataset catalog.
            Please click the button below and you will be redirected to a Globus
            page to select your institution. After selecting your institution,
            you will be redirected to your institutional login page to enter
            your credentials.
          </p>
          <hr />
          <form action={logInWithGlobus}>
            <Button type="submit">Log in with Globus</Button>
          </form>
        </Alert>
      </Container>
    </BasicLayout>
  );
}
