'use client';

import AppModal from '@/components/AppModal';
import { Button } from 'antd';
import { useState } from 'react';

export default function TermsOfUse({
  termsText,
  authorizedToViewData,
  summaryDataSource,
}) {
  const [modal, setModal] = useState(false);

  const handleShow = () =>
    setModal({
      ...modal,
      open: true,
      cancelCSS: 'none',
      className: 'ant-modal--hero',
    });

  return (
    <div key="terms_of_use" className="card  text-bg-warning px-4 pt-3 mb-2">
      <h1 className="fs-4">Terms of Use</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: termsText,
        }}
      />
      {!authorizedToViewData && (
        <>
          <Button
            className={'mb-1'}
            type={'primary'}
            style={{ alignSelf: 'flex-start' }}
            onClick={handleShow}
          >
            Request Access
          </Button>

          <AppModal
            modal={{
              ...modal,
              title: 'Request Access',
              body: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `If you wish to request access to ${summaryDataSource.name}, contact <a href="mailto:BCRFGDH@pitt.edu">BCRFGDH@pitt.edu</a> and provide the data source you require access to.`,
                  }}
                />
              ),
            }}
            setModal={setModal}
          />
        </>
      )}
    </div>
  );
}
