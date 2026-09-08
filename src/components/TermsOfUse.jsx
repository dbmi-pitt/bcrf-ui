'use client';

import React from 'react';
import { message, Popconfirm } from 'antd';

export default function TermsOfUse({
  termsText,
  authorizedToViewData,
  summaryDataSourceName,
  user,
}) {
  const [messageApi, holder] = message.useMessage();

  const sendEmail = async () => {
    return fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: 'globusDataSet',
        to: 'mas400@pitt.edu',
        subject: 'Request Globus Data Sets Access',
        templateProps: {
          sourceName: summaryDataSourceName,
          user: user,
        },
      }),
    });
  };
  const confirm = async (e) => {
    console.log(e);

    try {
      const response = await sendEmail();
      const data = await response.json();

      if (response.ok) {
        messageApi.success('Request sent successfully');
      } else {
        messageApi.error(
          `Failed to send request${data?.error?.message ? `: ${data.error.message}` : ''}`,
        );
      }
    } catch (err) {
      console.error(err);
      messageApi.error('Failed to send request');
    }
  };

  const cancel = (e) => {
    console.log(e);
  };
  return (
    <div key="terms_of_use" className="card  text-bg-warning px-4 pt-3 mb-2">
      <h1 className="fs-4">Terms of Use</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: termsText,
        }}
      />
      {authorizedToViewData && (
        <>
          {holder}
          <Popconfirm
            title="Request Access"
            description="Do you want to request access to this data source's data sets?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <buton
              className="c-btn c-btn--primary rounded-0 text-white d-block mb-2"
              style={{ alignSelf: 'flex-start' }}
            >
              Request Access
            </buton>
          </Popconfirm>
        </>
      )}
    </div>
  );
}
