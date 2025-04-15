import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, Users, Award, LucideIcon, Lightbulb, BookOpen } from 'lucide-react';

// Initiative card component for the Reinvestment page
interface InitiativeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  linkText?: string;
  gradientColors: string;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({ 
  title, 
  description, 
  icon, 
  link, 
  linkText = "Learn More",
  gradientColors 
}) => {
  return (
    <Card className="overflow-hidden border border-border/40 backdrop-blur-sm bg-background/60 transition-all duration-300 hover:shadow-lg hover:border-primary/40">
      <div className={`h-1.5 w-full ${gradientColors}`}></div>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
      {link && (
        <CardFooter>
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <a href={link}>{linkText}</a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function ReinvestmentPage() {
  // Initiatives data
  const initiatives = [
    {
      title: "Scholarship Fund",
      description: "Our scholarship program provides educational support to talented students from underrepresented groups, aiming to create more diverse and inclusive tech communities.",
      icon: <Award className="h-5 w-5 text-amber-500" />,
      link: "#scholarships",
      linkText: "Apply for Scholarship",
      gradientColors: "bg-gradient-to-r from-amber-500 to-yellow-400"
    },
    {
      title: "Community Grants",
      description: "We provide annual grants for new initiatives that enrich learning experiences. Local organizations with innovative ideas can apply for funding and mentorship.",
      icon: <Lightbulb className="h-5 w-5 text-green-500" />,
      link: "#grants",
      linkText: "Submit a Proposal",
      gradientColors: "bg-gradient-to-r from-green-500 to-emerald-400"
    },
    {
      title: "Educational Partnerships",
      description: "We collaborate with nonprofits, schools, and mentors to develop comprehensive youth development programs focused on technology and creative skills.",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      link: "#partnerships",
      linkText: "Become a Partner",
      gradientColors: "bg-gradient-to-r from-blue-500 to-cyan-400"
    },
    {
      title: "Learning Resources",
      description: "We develop and distribute free learning resources to communities in need, including curriculum materials, coding tools, and creative technology guides.",
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      link: "#resources",
      linkText: "Access Resources",
      gradientColors: "bg-gradient-to-r from-purple-500 to-violet-400"
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">
              Reinvestment
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              We believe in giving back to the community through targeted programs and resources. 
              Our reinvestment strategy includes funding innovative projects, providing scholarships, 
              and supporting local organizations.
            </p>
          </motion.div>
        </div>

        {/* Community Impact Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">2,500+</h3>
            <p className="text-foreground/70">Students Supported</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">35+</h3>
            <p className="text-foreground/70">Community Projects Funded</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-border/30 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">$1.5M</h3>
            <p className="text-foreground/70">Reinvested in Communities</p>
          </motion.div>
        </motion.div>

        {/* Current Initiatives */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4">Current Initiatives</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our ongoing programs are designed to create lasting impact through education, innovation, and community support.
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {initiatives.map((initiative, index) => (
              <motion.div key={index} variants={itemVariants}>
                <InitiativeCard {...initiative} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Get Involved CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-xl p-8 bg-gradient-to-r from-primary/20 to-pink-700/20 backdrop-blur-md border border-primary/30 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            If you'd like to propose a new initiative or apply for support, contact our Reinvestment Team. 
            We're always looking for passionate individuals and organizations to collaborate with.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
            <Mail className="h-4 w-4 mr-2" />
            <a href="mailto:reinvest@nurd.community">Contact Us</a>
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}