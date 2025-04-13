import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Check, CircleUser, Palette, Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const themeFormSchema = z.object({
  colorScheme: z.enum(['default', 'green', 'blue', 'purple', 'orange']),
  appearance: z.enum(['light', 'dark', 'system']),
  radius: z.number().min(0).max(1),
  animations: z.boolean(),
  hapticFeedback: z.boolean(),
});

export type ThemeFormValues = z.infer<typeof themeFormSchema>;

interface ThemeCustomizerProps {
  initialTheme?: Partial<ThemeFormValues>;
  onSave?: (values: ThemeFormValues) => void;
}

const colorSchemes = [
  {
    value: 'default',
    label: 'NURD Green',
    cardClassName: 'bg-gradient-to-br from-[#23c55e] to-[#16a34a]'
  },
  {
    value: 'blue',
    label: 'Ocean Blue',
    cardClassName: 'bg-gradient-to-br from-[#3b82f6] to-[#1e40af]'
  },
  {
    value: 'purple',
    label: 'Creative Purple',
    cardClassName: 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]'
  },
  {
    value: 'orange',
    label: 'Energetic Orange',
    cardClassName: 'bg-gradient-to-br from-[#f97316] to-[#ea580c]'
  },
];

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  initialTheme = {},
  onSave
}) => {
  const { toast } = useToast();
  const [previewTheme, setPreviewTheme] = useState(initialTheme.colorScheme || 'default');
  
  // Theme Form
  const themeForm = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      colorScheme: initialTheme.colorScheme || 'default',
      appearance: initialTheme.appearance || 'system',
      radius: initialTheme.radius !== undefined ? initialTheme.radius : 0.5,
      animations: initialTheme.animations !== undefined ? initialTheme.animations : true,
      hapticFeedback: initialTheme.hapticFeedback !== undefined ? initialTheme.hapticFeedback : true,
    },
  });
  
  const onThemeSubmit = (values: ThemeFormValues) => {
    toast({
      title: "Theme settings updated",
      description: "Your dashboard theme has been updated successfully.",
    });
    
    if (onSave) {
      onSave(values);
    }
  };
  
  const watchColorScheme = themeForm.watch('colorScheme');
  const watchRadius = themeForm.watch('radius');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Form {...themeForm}>
        <form onSubmit={themeForm.handleSubmit(onThemeSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Theme Preview */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Theme Preview</CardTitle>
                  <CardDescription>See how your theme looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`rounded-lg shadow-md overflow-hidden ${watchRadius > 0.5 ? 'rounded-xl' : watchRadius < 0.2 ? 'rounded' : 'rounded-lg'}`}>
                    {/* Preview header */}
                    <div className={`p-4 text-white ${
                      colorSchemes.find(scheme => scheme.value === watchColorScheme)?.cardClassName || 
                      'bg-gradient-to-br from-[#23c55e] to-[#16a34a]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <CircleUser className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">Your Dashboard</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                          <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                          <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview content */}
                    <div className="bg-white dark:bg-gray-900 p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-500">Customize your dashboard appearance</p>
                </CardFooter>
              </Card>
            </div>
            
            {/* Theme Settings */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personalize Your Dashboard</CardTitle>
                  <CardDescription>
                    Customize how your dashboard looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={themeForm.control}
                    name="colorScheme"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Color Scheme</FormLabel>
                        <FormDescription>
                          Choose a color theme for your dashboard
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {colorSchemes.map((scheme) => (
                            <div key={scheme.value}>
                              <FormLabel
                                htmlFor={`color-${scheme.value}`}
                                className="cursor-pointer"
                              >
                                <div className="relative">
                                  <div 
                                    className={`h-20 ${scheme.cardClassName} rounded-md flex items-end justify-center p-2 border-2 ${
                                      field.value === scheme.value 
                                        ? 'border-primary' 
                                        : 'border-transparent'
                                    }`}
                                  >
                                    {field.value === scheme.value && (
                                      <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center">
                                        <Check className="h-3 w-3" />
                                      </div>
                                    )}
                                    <span className="text-white text-xs font-medium">
                                      {scheme.label}
                                    </span>
                                  </div>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <RadioGroupItem
                                  value={scheme.value}
                                  id={`color-${scheme.value}`}
                                  className="sr-only"
                                />
                              </FormControl>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={themeForm.control}
                    name="appearance"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Appearance</FormLabel>
                        <FormDescription>
                          Choose your preferred appearance mode
                        </FormDescription>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem className="flex flex-col items-center space-y-2">
                            <FormControl>
                              <RadioGroupItem
                                value="light"
                                id="appearance-light"
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="appearance-light"
                              className={`cursor-pointer flex flex-col items-center rounded-md border-2 p-4 ${
                                field.value === 'light'
                                  ? 'border-primary'
                                  : 'border-transparent'
                              }`}
                            >
                              <Sun className="mb-2 h-6 w-6" />
                              <span>Light</span>
                            </FormLabel>
                          </FormItem>
                          
                          <FormItem className="flex flex-col items-center space-y-2">
                            <FormControl>
                              <RadioGroupItem
                                value="dark"
                                id="appearance-dark"
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="appearance-dark"
                              className={`cursor-pointer flex flex-col items-center rounded-md border-2 p-4 ${
                                field.value === 'dark'
                                  ? 'border-primary'
                                  : 'border-transparent'
                              }`}
                            >
                              <Moon className="mb-2 h-6 w-6" />
                              <span>Dark</span>
                            </FormLabel>
                          </FormItem>
                          
                          <FormItem className="flex flex-col items-center space-y-2">
                            <FormControl>
                              <RadioGroupItem
                                value="system"
                                id="appearance-system"
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="appearance-system"
                              className={`cursor-pointer flex flex-col items-center rounded-md border-2 p-4 ${
                                field.value === 'system'
                                  ? 'border-primary'
                                  : 'border-transparent'
                              }`}
                            >
                              <Monitor className="mb-2 h-6 w-6" />
                              <span>System</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={themeForm.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex justify-between items-center">
                          <FormLabel>Border Radius</FormLabel>
                          <span className="text-sm text-gray-500">
                            {field.value === 0
                              ? "None"
                              : field.value < 0.3
                              ? "Subtle"
                              : field.value < 0.7
                              ? "Medium"
                              : "Full"}
                          </span>
                        </div>
                        <FormDescription>
                          Adjust the roundness of UI elements
                        </FormDescription>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={1}
                            step={0.1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={themeForm.control}
                      name="animations"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                UI Animations
                              </div>
                            </FormLabel>
                            <FormDescription>
                              Enable animations and transitions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={themeForm.control}
                      name="hapticFeedback"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Haptic Feedback
                              </div>
                            </FormLabel>
                            <FormDescription>
                              Enable vibration feedback on interactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Save Theme Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ThemeCustomizer;