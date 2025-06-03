import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, CheckCircle, FileText, BookOpen, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface LessonExporterProps {
  lesson: {
    id: string;
    title: string;
    content: string;
  };
  module: {
    title: string;
  };
}

export function LessonExporter({ lesson, module }: LessonExporterProps) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call an API endpoint to generate the file
      // and then use browser APIs to download it
      
      // For PDF/DOCX export, you would typically need a server-side component 
      // that generates these files from the lesson content
      
      // For simplicity, we're just creating a text file for now
      const content = `# ${module.title} - ${lesson.title}\n\n${lesson.content}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lesson.title}.${exportFormat === 'text' ? 'txt' : exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Lesson has been exported as ${exportFormat.toUpperCase()}`,
        variant: "default",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your lesson",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons = {
    pdf: <FileText className="h-6 w-6 text-red-500" />,
    docx: <File className="h-6 w-6 text-blue-500" />,
    text: <BookOpen className="h-6 w-6 text-green-500" />
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="h-4 w-4 mr-2" />
          Export Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Lesson</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-1">Export Format</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred format for downloading this lesson
          </p>
          
          <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="gap-4">
            {['pdf', 'docx', 'text'].map((format) => (
              <div key={format} className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value={format} id={`format-${format}`} />
                <Label htmlFor={`format-${format}`} className="flex items-center">
                  {formatIcons[format as keyof typeof formatIcons]}
                  <span className="ml-3">
                    <span className="font-medium capitalize block">{format === 'docx' ? 'Word Document' : format === 'pdf' ? 'PDF Document' : 'Plain Text'}</span>
                    <span className="text-sm text-muted-foreground">
                      {format === 'docx' ? 'Editable in Microsoft Word or Google Docs' : 
                       format === 'pdf' ? 'Best for printing and sharing' :
                       'Simple text format, smallest file size'}
                    </span>
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}