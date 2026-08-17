import Alert from 'react-bootstrap/Alert';
import AlertHeading from 'react-bootstrap/AlertHeading';

function AppBanner({ bannerKey = 'default', content }) {
  const banner = content[bannerKey];

  if (!banner) {
    return <></>;
  }

  return (
    <div className={`c-banner ${banner.containerClassName || 'mt-3'}`}>
      <Alert variant={banner.variant}>
        {banner.title && <AlertHeading>{banner.title}</AlertHeading>}
        <div dangerouslySetInnerHTML={{ __html: banner.content }}></div>
      </Alert>
    </div>
  );
}

export default AppBanner;
