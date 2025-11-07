import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import HowCanWeHelp from "@/components/sections/how-can-we-help";
import TemplateGrid from "@/components/sections/template-grid";
import WhyUsersChoose from "@/components/sections/why-users-choose";
import FinalCta from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <HowCanWeHelp />
        
        <section className="bg-background-light py-16 md:py-24">
          <div className="container">
            <h2 className="text-center text-3xl md:text-4xl font-semibold text-text-primary mb-4 tracking-[-0.01em]">
              Our Most Popular Resume Templates
            </h2>
            <p className="text-center text-lg text-text-secondary mb-12 max-w-3xl mx-auto">
              Choose from our professionally designed templates. Each template is crafted to help you stand out and pass ATS screening.
            </p>
            <TemplateGrid />
          </div>
        </section>

        <WhyUsersChoose />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}