/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Rajan Bhatta - Brand Designer & Visual Identity Strategist',
  description:
    'Rajan Bhatta (brandwithrajan) is a brand designer from Nepal specializing in visual identity, brand systems, and design strategy — also an entrepreneur building ventures across tech and marketing.',
  keywords: [
    'Rajan Bhatta',
    'Brand Designer',
    'Visual Identity',
    'Brand Systems',
    'Brand Strategist Nepal',
    'Color Strategy',
    'Brand Identity',
    'Rebrand',
    'brandwithrajan',
    'Brand Design Nepal',
    'Visual Identity Designer',
    'Raj',
    'Entrepreneur',
    'Business Strategist',
    'Tech Enthusiast',
    'Portfolio',
    'Web Development',
    'Nepal',
    'Startup Founder',
    'Digital Marketing',
    'Business Development',
    'Creative Professional',
    'Graphic Design',
    'SEO',
    'Dhangadhi',
    'Mahendranagar',
    'Baitadi',
    'Darchula',
    'Doti',
    'Bajhang',
    'Kathmandu',
    'Bhaktapur',
    'Lalitpur',
    'Pokhara',
    'Chitwan',
    'Butwal',
    'Birgunj',
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <Clients />
      <Quote />
      <Projects />
    </>
  );
}

export default Page;
