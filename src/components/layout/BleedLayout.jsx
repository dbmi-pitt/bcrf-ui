import AppBanner from '@/components/AppBanner';
import AppFooter from '@/components/layout/AppFooter';
import AppNavBar from '@/components/layout/AppNavBar';

const BleedLayout = ({ bannerContent, children, classNameMain = '' }) => {
  return (
    <div className="body__wrapper bg--dirtyWhite">
      <AppNavBar />
      <AppBanner content={bannerContent} />
      <main className={`c-main m-0 ${classNameMain}`}>{children}</main>
      <AppFooter />
    </div>
  );
};

export default BleedLayout;
