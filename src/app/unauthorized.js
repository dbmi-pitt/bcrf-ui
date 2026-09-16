import BasicLayout from '@/components/layout/BasicLayout';
import {  Result } from 'antd';
import Link from 'next/link';

// unauthorized is currently experimental in Next.js 16. Eventually we will be
// able to display the page with unauthorized(), like the not found page.
// https://nextjs.org/docs/app/api-reference/functions/unauthorized
export default function Unauthorized() {
  return (
    <BasicLayout classNameMain="mt-2">
      <Result
        status="403"
        title="Unauthorized"
        subTitle={
          <p>
            Sorry, you are not authorized to view this page. Please contact us
            via <a href="mailto:BCRFGDH@pitt.edu">BCRFGDH@pitt.edu</a> to
            request access.
          </p>
        }
        extra={[
          <Link className='c-btn c-btn--sm c-btn--outline c-btn--outline--pink' key="home" href="/">
            Back Home
          </Link>,
        ]}
      />
    </BasicLayout>
  );
}
