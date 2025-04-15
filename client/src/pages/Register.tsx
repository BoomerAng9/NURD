import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import NurdLogo from '@/components/ui/nurd-logo';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { GlassNav } from '@/components/ui/glass-nav';

const Register: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTrainerForm, setIsTrainerForm] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ name: string; url: string }[]>([]);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    user_type: 'trainer',
    age: '',
    grade_level: '',
    gender: '',
    path_choice: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    
    // Validate each file
    Array.from(files).forEach(file => {
      // Check file type - only allow PDFs, images, and common document types
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload PDF, image, or document files only.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File too large. Maximum file size is 5MB.');
        return;
      }
      
      newFiles.push(file);
    });
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Create a FormData object to send the file to our API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${Date.now()}-${file.name}`);
      formData.append('fileType', file.type);
      
      const response = await fetch('/api/upload-credential', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error instanceof Error ? error.message : 'File upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const uploadAllFiles = async (): Promise<{ name: string; url: string }[]> => {
    if (uploadedFiles.length === 0) return [];
    
    const results: { name: string; url: string }[] = [];
    toast({
      title: "Uploading Credentials",
      description: "Please wait while we upload your credentials...",
    });
    
    try {
      for (const file of uploadedFiles) {
        const url = await uploadToStorage(file);
        if (url) {
          results.push({ name: file.name, url });
        }
      }
      
      if (results.length > 0) {
        toast({
          title: "Credentials Uploaded",
          description: `Successfully uploaded ${results.length} file(s)`,
        });
      }
      
      return results;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload some files",
        variant: "destructive"
      });
      return results;
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    // Trainer form validation
    if (!formData.first_name) return 'First name is required';
    if (!formData.last_name) return 'Last name is required';
    if (!formData.email) return 'Email address is required';
    if (!formData.phone) return 'Phone number is required';
    if (!formData.path_choice) return 'Please select your area of expertise';
    if (!formData.experience) return 'Teaching experience is required';
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
      // Step 1: Upload credentials if any exist
      let credentialUrls: { name: string; url: string }[] = [];
      if (uploadedFiles.length > 0) {
        credentialUrls = await uploadAllFiles();
        if (credentialUrls.length === 0 && uploadedFiles.length > 0) {
          throw new Error('Failed to upload credential files');
        }
      }
      
      // Step 2: Register user with API
      const response = await apiRequest('POST', '/api/register-trainer', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        expertise: formData.path_choice,
        experience: formData.experience,
        user_type: 'trainer',
        username: formData.username,
        password: formData.password,
        credentials: credentialUrls
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      toast({
        title: "Application Submitted!",
        description: "Your trainer application has been submitted for review. We'll contact you soon!",
      });
      
      // Redirect to confirmation page
      setLocation('/application-confirmation');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <GlassNav />
      
      <div className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/10 rounded-xl shadow-lg overflow-hidden border border-gray-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10">
                <div className="mb-6 flex items-center justify-center md:justify-start">
                  <NurdLogo variant="default" showTagline={true} />
                </div>
                
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-6 text-center md:text-left">
                  Apply to Teach with NURD
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-200 mb-1">First Name</label>
                      <input 
                        type="text" 
                        id="first_name" 
                        name="first_name" 
                        value={formData.first_name}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-200 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        id="last_name" 
                        name="last_name" 
                        value={formData.last_name}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Your email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-200 mb-1">Skills & Expertise</label>
                    <select 
                      id="path_choice" 
                      name="path_choice" 
                      value={formData.path_choice}
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="" disabled>Select your primary area of expertise...</option>
                      <option value="game_development">Game Development</option>
                      <option value="web_design">Web & App Design</option>
                      <option value="digital_art">Digital Art & Animation</option>
                      <option value="ai_machine_learning">AI & Machine Learning</option>
                      <option value="robotics">Robotics & Hardware</option>
                      <option value="soft_skills">Soft Skills & Communication</option>
                      <option value="multiple">Multiple Areas (specify in experience)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-200 mb-1">
                      Teaching Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      rows={4}
                      placeholder="Describe your teaching experience and qualifications"
                    />
                  </div>
                  
                  {/* Credentials Upload Section */}
                  <div className="pt-4 mt-2 border-t border-gray-700/30">
                    <h3 className="font-medium text-white mb-3">Upload Credentials</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Please upload relevant certifications, degrees, or documents that verify your qualifications.
                      Accepted formats: PDF, JPG, PNG, DOC/DOCX (Max 5MB per file)
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    
                    <div className="flex flex-col space-y-4">
                      <div 
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-primary/50 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm text-center text-gray-300">
                          Click to upload or drag and drop your files here
                        </p>
                      </div>
                      
                      {uploadError && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 py-2 px-4 rounded-md flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">{uploadError}</span>
                        </div>
                      )}
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 mt-2">
                          <h4 className="text-sm font-medium text-gray-200">Uploaded Files:</h4>
                          <ul className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <li 
                                key={index} 
                                className="bg-gray-800/40 rounded-md p-2 flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center">
                                  <FileCheck className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-white truncate max-w-[200px]">{file.name}</span>
                                  <span className="text-gray-400 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-3">
                      All credentials will be verified by our team. Your application may be pending until verification is complete.
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-700/30">
                    <h3 className="font-medium text-white mb-3">Create Account Credentials</h3>
                    
                    <div className="mb-3">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">Username</label>
                      <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Choose a username"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Create a password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-200 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirm_password" 
                        name="confirm_password" 
                        value={formData.confirm_password}
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-md font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting Application...' : 'Submit Trainer Application'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="hidden md:block relative bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20">
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1571260899304-425eee4c7efd?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white">
                    <div className="bg-black/50 p-8 rounded-lg backdrop-blur-md max-w-sm border border-white/10">
                      <h3 className="font-heading font-bold text-2xl mb-4">Become a NURD Trainer</h3>
                      <p className="mb-6">Join our team of educators and help shape the next generation of tech innovators. As a NURD trainer, you'll have the opportunity to share your expertise and inspire young minds.</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <p className="text-sm">Flexible teaching schedule with both in-person and virtual opportunities</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <p className="text-sm">Competitive compensation and professional development</p>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <p className="text-sm">Access to cutting-edge teaching resources and AI-assisted tools</p>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-xs text-gray-300 border-t border-gray-700 pt-4">
                        Note: All applications are subject to review and background checks. We prioritize candidate safety and excellence.
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
