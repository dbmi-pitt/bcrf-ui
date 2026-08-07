import { logInWithGlobus } from '@/lib/actions/auth';

export default function LogIn() {
  return (
    <form action={logInWithGlobus}>
      <button type="submit">Log in with Globus</button>
    </form>
  );
}
