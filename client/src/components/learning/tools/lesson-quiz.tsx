import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle, AlertCircle, BrainCircuit, Trophy, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizProps {
  lessonId: string;
  lessonTitle: string;
  onComplete: (score: number, totalQuestions: number) => void;
  questions?: QuizQuestion[];
}

export function LessonQuiz({ lessonId, lessonTitle, onComplete, questions: propQuestions }: LessonQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample questions if none provided
  const defaultQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the primary purpose of this lesson?',
      options: [
        'To introduce basic concepts',
        'To provide advanced techniques',
        'To demonstrate practical applications',
        'To review previous material'
      ],
      correctAnswer: 0,
      explanation: 'This lesson focuses on introducing the fundamental concepts that serve as a foundation for the more advanced topics.'
    },
    {
      id: '2',
      question: 'Which technique is most emphasized in this lesson?',
      options: [
        'Iterative development',
        'Top-down design',
        'Component-based architecture',
        'Functional programming'
      ],
      correctAnswer: 2,
      explanation: 'Component-based architecture is the core technique emphasized throughout the examples and exercises in this lesson.'
    },
    {
      id: '3',
      question: 'What is a key benefit of the approach taught in this lesson?',
      options: [
        'Faster processing speed',
        'Improved code maintainability',
        'Reduced memory usage',
        'Better database performance'
      ],
      correctAnswer: 1,
      explanation: 'The modular approach taught in this lesson primarily improves code maintainability by separating concerns and creating reusable components.'
    }
  ];
  
  const questions = propQuestions || defaultQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleSelectAnswer = (value: string) => {
    const answerIndex = parseInt(value, 10);
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerIndex
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };
  
  const getScorePercentage = () => {
    return (calculateScore() / questions.length) * 100;
  };
  
  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to save results
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const score = calculateScore();
      const percentage = getScorePercentage();
      
      // Show confetti for good scores
      if (percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Call the onComplete callback
      onComplete(score, questions.length);
      
      setQuizSubmitted(true);
      
      toast({
        title: score === questions.length ? "Perfect Score!" : "Quiz Completed",
        description: `You scored ${score} out of ${questions.length} questions correctly.`,
        variant: percentage >= 70 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your quiz.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseQuiz = () => {
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizSubmitted(false);
    setIsOpen(false);
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizSubmitted(false);
  };
  
  const isAnswerSelected = currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;
  const isQuizCompleted = Object.keys(selectedAnswers).length === questions.length;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <BrainCircuit className="h-4 w-4 mr-2" />
          Take Lesson Quiz
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{showResults ? "Quiz Results" : `Quiz: ${lessonTitle}`}</DialogTitle>
          {!showResults && (
            <DialogDescription>
              Test your understanding of this lesson
            </DialogDescription>
          )}
        </DialogHeader>
        
        {!showResults ? (
          <div className="py-4">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>
                  {Object.keys(selectedAnswers).length} of {questions.length} answered
                </span>
              </div>
              <Progress value={(currentQuestionIndex / (questions.length - 1)) * 100} className="h-2" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                
                <RadioGroup 
                  value={selectedAnswers[currentQuestion.id]?.toString() || ""} 
                  onValueChange={handleSelectAnswer}
                  className="gap-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswerSelected}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => setShowResults(true)}
                  disabled={!isAnswerSelected}
                >
                  Show Results
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4">
            {!quizSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    You've answered all {questions.length} questions
                  </h3>
                  <p className="text-muted-foreground">
                    {isQuizCompleted 
                      ? "Review your answers before submitting"
                      : `You've answered ${Object.keys(selectedAnswers).length} of ${questions.length} questions. Please answer all questions before submitting.`
                    }
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  {questions.map((question, index) => {
                    const isAnswered = selectedAnswers[question.id] !== undefined;
                    
                    return (
                      <div 
                        key={question.id} 
                        className={`p-3 rounded-lg border ${
                          isAnswered ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {isAnswered ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Question {index + 1}</p>
                            <p className="text-sm text-muted-foreground truncate">{question.question}</p>
                            
                            {isAnswered && (
                              <div className="mt-1">
                                <Badge variant="outline">
                                  Option {selectedAnswers[question.id] + 1} selected
                                </Badge>
                              </div>
                            )}
                            
                            {!isAnswered && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="px-0 h-6 text-xs" 
                                onClick={() => setCurrentQuestionIndex(index)}
                              >
                                Answer this question
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseQuiz}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuiz} disabled={!isQuizCompleted || isLoading}>
                    {isLoading ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-4">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {getScorePercentage() >= 70 ? (
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Trophy className="h-12 w-12 text-primary" />
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-100 rounded-full">
                        <Award className="h-12 w-12 text-amber-600" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {getScorePercentage() === 100 
                      ? "Perfect Score!" 
                      : getScorePercentage() >= 70 
                        ? "Well Done!" 
                        : "Good Try!"}
                  </h3>
                  
                  <p className="text-xl mb-2">
                    You scored <span className="font-bold">{calculateScore()}</span> out of <span className="font-bold">{questions.length}</span>
                  </p>
                  
                  <div className="w-full max-w-xs mx-auto mb-4">
                    <Progress value={getScorePercentage()} className="h-3" />
                    <p className="text-right text-sm text-muted-foreground mt-1">
                      {getScorePercentage()}%
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-6">
                  {questions.map((question, index) => {
                    const selectedAnswer = selectedAnswers[question.id];
                    const isCorrect = selectedAnswer === question.correctAnswer;
                    
                    return (
                      <div 
                        key={question.id} 
                        className={`p-4 rounded-lg border ${
                          isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30' : 
                                     'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Question {index + 1}</p>
                            <p className="mb-2">{question.question}</p>
                            
                            <div className="mb-2">
                              <p className="text-sm font-medium">Your answer:</p>
                              <p className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                {question.options[selectedAnswer]}
                              </p>
                            </div>
                            
                            {!isCorrect && (
                              <div className="mb-2">
                                <p className="text-sm font-medium">Correct answer:</p>
                                <p className="text-green-700 dark:text-green-400">
                                  {question.options[question.correctAnswer]}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p className="font-medium">Explanation:</p>
                              <p>{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handleCloseQuiz}>
                    Close
                  </Button>
                  <Button variant="default" onClick={handleRestartQuiz}>
                    Retry Quiz
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}