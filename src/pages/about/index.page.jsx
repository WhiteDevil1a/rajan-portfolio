/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const SITE_URL = 'https://rajanbhatta.com.np';

function Page() {
  return (
    <>
      <CustomHead
        title="About Rajan Bhatta – Brand Designer from Nepal"
        description="Learn about Rajan Bhatta's journey as a brand designer and visual identity specialist from Nepal — building brand systems, color strategies, and creative ventures."
        canonical={`${SITE_URL}/about`}
      />
      <Hero />
      <Overview />
      <Services />
      <Process />
    </>
  );
}

export default Page;
