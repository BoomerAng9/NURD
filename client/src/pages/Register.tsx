import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/components/ui/supabase-provider';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import NurdLogo from '@/components/ui/nurd-logo';
import { apiRequest } from '@/lib/queryClient';

const Register: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    age: '',
    grade_level: '',
    user_type: '',
    gender: '',
    path_choice: '',
    username: '',
    password: '',
    confirm_password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.first_name) return 'First name is required';
    if (!formData.age) return 'Age is required';
    if (parseInt(formData.age) < 8 || parseInt(formData.age) > 18) return 'Age must be between 8 and 18';
    if (!formData.grade_level) return 'Grade level is required';
    if (!formData.user_type) return 'Please select if you are a parent or student';
    if (!formData.gender) return 'Please select your gender';
    if (!formData.username) return 'Username is required';
    if (formData.username.length < 3) return 'Username must be at least 3 characters';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirm_password) return 'Passwords do not match';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register user with Express backend
      const response = await apiRequest('POST', '/api/register', {
        first_name: formData.first_name,
        age: parseInt(formData.age),
        grade_level: formData.grade_level,
        user_type: formData.user_type,
        gender: formData.gender,
        path_choice: formData.path_choice || undefined,
        username: formData.username,
        password: formData.password
      });

      if (response.ok) {
        // Also add to Supabase for the demo
        const { error: supabaseError } = await supabase
          .from('users')
          .insert([{
            first_name: formData.first_name,
            age: parseInt(formData.age),
            grade_level: formData.grade_level,
            user_type: formData.user_type,
            gender: formData.gender,
            path_choice: formData.path_choice || null
          }]);

        if (supabaseError) throw new Error(supabaseError.message);
        
        toast({
          title: "Registration Successful!",
          description: "You're now part of the NURD community!",
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="mb-6 flex items-center justify-center md:justify-start">
                  <NurdLogo variant="default" showTagline={true} />
                </div>
                
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-6 text-center md:text-left">
                  Join the Summer Initiative
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      id="first_name" 
                      name="first_name" 
                      value={formData.first_name}
                      onChange={handleInputChange} 
                      className="input-nurd" 
                      required
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input 
                        type="number" 
                        id="age" 
                        name="age" 
                        value={formData.age}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                        placeholder="Your age"
                        min="8"
                        max="18"
                      />
                    </div>
                    <div>
                      <label htmlFor="grade_level" className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                      <input 
                        type="text" 
                        id="grade_level" 
                        name="grade_level" 
                        value={formData.grade_level}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                        placeholder="e.g., 7th grade"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                      <select 
                        id="user_type" 
                        name="user_type" 
                        value={formData.user_type}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                      >
                        <option value="" disabled>Select...</option>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select 
                        id="gender" 
                        name="gender" 
                        value={formData.gender}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                      >
                        <option value="" disabled>Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="path_choice" className="block text-sm font-medium text-gray-700 mb-1">Interest Area (Optional)</label>
                    <select 
                      id="path_choice" 
                      name="path_choice" 
                      value={formData.path_choice}
                      onChange={handleInputChange} 
                      className="input-nurd"
                    >
                      <option value="" disabled>Select an area of interest...</option>
                      <option value="game_development">Game Development</option>
                      <option value="web_design">Web & App Design</option>
                      <option value="digital_art">Digital Art & Animation</option>
                      <option value="ai_machine_learning">AI & Machine Learning</option>
                      <option value="robotics">Robotics & Hardware</option>
                      <option value="not_sure">Not sure yet (we'll help you decide)</option>
                    </select>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Create Account Credentials</h3>
                    
                    <div className="mb-3">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                        placeholder="Choose a username"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                        placeholder="Create a password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirm_password" 
                        name="confirm_password" 
                        value={formData.confirm_password}
                        onChange={handleInputChange} 
                        className="input-nurd" 
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="btn-nurd w-full text-center py-4"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Start Your NURD Journey'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-nurd">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white">
                    <div className="bg-gray-900/70 p-8 rounded-lg backdrop-blur-sm max-w-sm">
                      <h3 className="font-heading font-bold text-2xl mb-4">Ready to Become a NURD?</h3>
                      <p className="mb-4">Join our community of young creators, innovators, and problem-solvers. The NURD Summer Initiative is where your creative journey begins!</p>
                      
                      <div className="flex items-start mt-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm">Register now and get early access to exclusive learning resources!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
