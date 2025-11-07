import { FileText, Mail, CheckCircle, BookOpen, Search, Sparkles } from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Our resume builder saves you time and gives you expert advice every step of the way. Building a professional resume has never been this simple.",
  },
  {
    icon: Mail,
    title: "Cover Letter Builder",
    description: "Create a job-winning cover letter in minutes with our easy drag-and-drop interface.",
  },
  {
    icon: CheckCircle,
    title: "ATS-Friendly Resume Templates",
    description: "Every template is crafted by HR pros and designers to make sure it includes all the essential content and looks sharp.",
  },
  {
    icon: BookOpen,
    title: "Free Career Advice Resources",
    description: (
      <>
        Take control of your career with helpful guides and resume examples.
        Need tips on writing the perfect application? Want to ask for a raise? Learn it all
        (and more) on our blog.
      </>
    ),
  },
  {
    icon: Search,
    title: "Resume Check",
    description: "Get instant feedback on your resume with our resume checker. See your score in real-time and get tips to make it better.",
  },
  {
    icon: Sparkles,
    title: "Ready-Made Content Suggestions",
    description: "Use expert-written content suggestions to build a professional job application in just minutes.",
  },
];

const HowCanWeHelp = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold tracking-[-0.01em] text-text-primary mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          How Can We Help You?
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li 
                key={feature.title} 
                className="flex items-start gap-6 group animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: '600ms'
                }}
              >
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-text-primary mb-1 group-hover:text-link-blue transition-colors duration-200">
                    {feature.title}
                  </h4>
                  <p className="text-base text-text-secondary m-0">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default HowCanWeHelp;