import React, { useState } from 'react';
import { useColorScheme, type ColorScheme } from '@/providers/color-scheme-provider';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from '@/components/ui/popover';
import { CheckIcon, PaletteIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ColorSchemePicker = () => {
  const { colorScheme, setColorScheme, availableSchemes } = useColorScheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative group"
          aria-label="Change color scheme"
        >
          <PaletteIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all group-hover:text-primary" />
          <span className="sr-only">Toggle color scheme</span>
          
          {/* Color indicator in bottom right */}
          <div 
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-background"
            style={{ 
              backgroundColor: availableSchemes.find(s => s.id === colorScheme)?.colors.primary || '#3760ff',
              boxShadow: '0 0 0 1px var(--background)' 
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="end">
        <div className="space-y-1">
          <h4 className="font-medium px-2 py-1.5 text-sm">Select Color Scheme</h4>
          <div className="grid grid-cols-1 gap-1">
            {availableSchemes.map((scheme) => (
              <Button
                key={scheme.id}
                variant="ghost"
                className={cn(
                  "justify-start font-normal w-full",
                  colorScheme === scheme.id && "bg-accent"
                )}
                onClick={() => {
                  setColorScheme(scheme.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center w-full">
                  {/* Color preview */}
                  <div 
                    className="h-7 w-7 rounded-full mr-2 p-0.5 transition-all"
                    style={{ 
                      background: `linear-gradient(135deg, ${scheme.colors.primary}, ${scheme.colors.accent})` 
                    }}
                  >
                    {colorScheme === scheme.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-full w-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center"
                      >
                        <CheckIcon className="h-4 w-4 text-primary" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span>{scheme.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {scheme.description}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};