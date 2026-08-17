import BasicLayout from '@/components/layout/BasicLayout';
import { Button, Result } from 'antd';

// unauthorized is currently experimental in Next.js 16. Eventually we will be
// able to display the page with unauthorized(), like the not found page.
// https://nextjs.org/docs/app/api-reference/functions/unauthorized
export default function Unauthorized() {
  return (
    <BasicLayout classNameMain="mt-2">
      <Result
        status="403"
        title="Unauthorized"
        subTitle="Sorry, you are not authorized to view this page."
        extra={[
          <Button key="home" type="primary" href="/">
            Back Home
          </Button>,
        ]}
      />
    </BasicLayout>
  );
}
