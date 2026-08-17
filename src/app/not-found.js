import BasicLayout from '@/components/layout/BasicLayout';
import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <BasicLayout classNameMain="mt-2">
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={[
          <Button key="home" type="primary" href="/">
            Back Home
          </Button>,
        ]}
      />
    </BasicLayout>
  );
}
