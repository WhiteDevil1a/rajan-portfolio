/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Rajan Bhatta - About',
  description: 'Learn about Rajan Bhatta\'s journey as a multi-disciplinary entrepreneur, tech enthusiast, and creative professional from Nepal.',
  keywords: [
    'Rajan Bhatta',
    'brandwithrajan',
    'About Rajan Bhatta',
    'About me',
    'Frontend Developer Journey',
    'Web Developer Story',
    'Professional Web Development',
    'Frontend Development Expertise',
    'Web Design Skills',
    'Web Development Services',
    'Web Design Expertise',
    'Developer Profile',
    'Quality Web Solutions',
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
