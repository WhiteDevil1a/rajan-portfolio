/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Rajan Bhatta - Entrepreneur & Tech Enthusiast Portfolio',
  description:
    'Rajan Bhatta is a multi-disciplinary entrepreneur, business strategist, and tech enthusiast from Nepal with experience across startups, technology, marketing, and creative industries.',
  keywords: [
    'Rajan Bhatta',
    'brandwithrajan',
    'Raj',
    'Entrepreneur',
    'Business Strategist',
    'Tech Enthusiast',
    'Portfolio',
    'Web Development',
    'UI/UX Design',
    'MERN Stack',
    'Next.js',
    'Laravel',
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
