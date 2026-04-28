import Hero from "@/components/Hero";

import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import About1 from '@/components/About1';
import TechStack from '@/components/TechStack';
export default function Home() {
  return (
    <div className=" min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    
    <Hero/>
    <About1 />
      <Services />
      <TechStack />
      <Projects />
      <Testimonials />
      <Contact />
    </div>
  );
}
