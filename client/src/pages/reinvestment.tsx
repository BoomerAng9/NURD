import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, HandHeart, GraduationCap, Building2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReinvestmentPage() {
  return (
    <div className="container mx-auto p-4 py-10 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
            Reinvestment
          </h1>
          <p className="text-xl mt-4 text-gray-200 max-w-2xl mx-auto">
            We believe in giving back to the community through targeted programs and resources. 
            Our reinvestment strategy includes funding innovative projects, providing scholarships, 
            and supporting local organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                Scholarship Fund
              </CardTitle>
              <CardDescription>
                Offering educational support to underrepresented groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our scholarship program aims to reduce barriers to tech education by providing financial 
                support to students from underrepresented backgrounds. Recipients receive mentorship, 
                equipment, and enrollment in our premium courses at no cost.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-green-400" />
                Community Grants
              </CardTitle>
              <CardDescription>
                Annual grants for new initiatives that enrich learning experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Each year, we allocate funding for innovative community projects that align with our 
                mission. These grants support grassroots initiatives, educational events, and technology 
                access programs across diverse communities.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10 bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border-indigo-700/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-400" />
              Partnerships
            </CardTitle>
            <CardDescription>
              Collaborations with nonprofits, schools, and mentors for youth development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h3 className="font-medium text-lg mb-2">Schools & Universities</h3>
                <p className="text-gray-300 text-sm">
                  We partner with educational institutions to bring coding curriculum to classrooms 
                  and provide professional development for teachers.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h3 className="font-medium text-lg mb-2">Nonprofit Organizations</h3>
                <p className="text-gray-300 text-sm">
                  Our collaborations with nonprofits help extend our reach to underserved communities 
                  through specialized programs and initiatives.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h3 className="font-medium text-lg mb-2">Industry Mentors</h3>
                <p className="text-gray-300 text-sm">
                  Tech professionals volunteer their time to mentor students, providing real-world 
                  guidance and career pathway support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl p-8 bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
          <p className="text-gray-200 mb-6 max-w-xl mx-auto">
            If you'd like to propose a new initiative or apply for support, contact our Reinvestment Team. 
            We're always looking for innovative ideas that align with our mission.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="gap-2 w-full sm:w-auto" variant="default">
              <Mail className="h-4 w-4" />
              <a href="mailto:reinvest@nurd.com">reinvest@nurd.com</a>
            </Button>
            <Button className="gap-2 w-full sm:w-auto" variant="outline">
              Apply for Support
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Our reinvestment programs are reviewed quarterly to ensure maximum impact and alignment with community needs.
          </p>
        </div>
      </motion.div>
    </div>
  );
}