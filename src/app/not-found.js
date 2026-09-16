import BasicLayout from '@/components/layout/BasicLayout';
import { Result } from 'antd';
import Link from 'next/link';

export default function NotFound() {
  return (
    <BasicLayout classNameMain="mt-2">
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={[
          <Link className="c-btn c-btn--sm c-btn--outline c-btn--outline--pink" key="home"  href="/">
            Back Home
          </Link>,
        ]}
      />
    </BasicLayout>
  );
}
