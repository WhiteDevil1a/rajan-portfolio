/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Rajan Bhatta - Brand Designer from Nepal',
  description: 'Learn about Rajan Bhatta\'s journey as a brand designer and visual identity specialist from Nepal — building brand systems, color strategies, and creative ventures.',
  keywords: [
    'Rajan Bhatta',
    'Brand Designer',
    'Visual Identity Nepal',
    'Brand Systems',
    'Brand Strategist',
    'Color Strategy',
    'brandwithrajan',
    'About Rajan Bhatta',
    'About me',
    'Brand Design Process',
    'Visual Identity Designer',
    'Brand Identity Nepal',
    'Creative Professional Nepal',
    'Developer Profile',
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

      <Hero />
      <Overview />
      <Services />
      <Process />
    </>
  );
}

export default Page;
