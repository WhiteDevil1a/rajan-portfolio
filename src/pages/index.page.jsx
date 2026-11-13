/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const SITE_URL = 'https://rajanbhatta.com.np';

function Page() {
  return (
    <>
      <CustomHead
        title="Rajan Bhatta – Brand Designer & Visual Identity Strategist"
        description="Rajan Bhatta (brandwithrajan) is a brand designer from Nepal specialising in visual identity, brand systems, and design strategy — also an entrepreneur building ventures across tech and marketing."
        canonical={SITE_URL}
        ogImage={`${SITE_URL}/og.png`}
      />
      <Home />
      <About />
      <Clients />
      <Quote />
      <Projects />
    </>
  );
}

export default Page;
