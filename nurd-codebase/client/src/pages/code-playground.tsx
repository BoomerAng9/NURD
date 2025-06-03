import React, { useState } from 'react';
import { CodeEditor } from '@/components/playground/code-editor';
import { CodeEnvironmentSetup } from '@/components/playground/code-environment-setup';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BookOpen, Code, Cpu, GraduationCap, MessagesSquare, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CHALLENGES = [
  {
    id: 'intro',
    title: 'Introduction to Coding',
    description: 'Learn the basics of programming with this simple challenge.',
    language: 'javascript',
    difficulty: 'beginner',
    code: `// Welcome to your first coding challenge!
// Follow the instructions below to complete the task.

// TASK: Create a function that says hello to your name
// 1. Create a function called 'sayHello' that takes a name parameter
// 2. Make it return "Hello, [name]!"
// 3. Call the function with your name
// 4. Run the code to see the result

// Write your solution below:

function sayHello(name) {
  // Your code here
}

// Call your function here
`,
    hint: 'Remember to use the return keyword in your function to send back a value!',
    solution: `function sayHello(name) {
  return "Hello, " + name + "!";
}

console.log(sayHello("NURD Coder"));`
  },
  {
    id: 'loops',
    title: 'Fun with Loops',
    description: 'Explore how to repeat code with loops to create patterns.',
    language: 'javascript',
    difficulty: 'beginner',
    code: `// Loops are powerful tools in programming!
// TASK: Create a simple counting pattern
// 1. Use a 'for' loop to count from 1 to 10
// 2. For even numbers, print "Even: [number]"
// 3. For odd numbers, print "Odd: [number]"

// Write your solution below:

// Your loop code here
`,
    hint: 'You can check if a number is even by using the modulo operator: number % 2 === 0',
    solution: `for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    console.log("Even: " + i);
  } else {
    console.log("Odd: " + i);
  }
}`
  },
  {
    id: 'html-intro',
    title: 'Build a Profile Card',
    description: 'Create a simple profile card using HTML and CSS.',
    language: 'html',
    difficulty: 'beginner',
    code: `<!DOCTYPE html>
<html>
<head>
  <title>My Profile Card</title>
  <style>
    /* Add your styles here */
    
  </style>
</head>
<body>
  <!-- TASK: Create a profile card with the following: -->
  <!-- 1. Add a heading with your name -->
  <!-- 2. Add a short bio paragraph -->
  <!-- 3. Add a list of 3 skills or hobbies -->
  <!-- 4. Style your card with CSS -->
  
  <!-- Write your solution below: -->
  
  
</body>
</html>`,
    hint: 'Use div elements to group your content, and try adding background-color, border-radius, and padding in your CSS.',
    solution: `<!DOCTYPE html>
<html>
<head>
  <title>My Profile Card</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    .card {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 300px;
    }
    .name {
      color: #3DE053;
      margin-top: 0;
    }
    .skills {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2 class="name">Jane Doe</h2>
    <p>I'm a NURD student who loves coding and technology!</p>
    <h3>My Skills:</h3>
    <ul class="skills">
      <li>JavaScript</li>
      <li>Web Design</li>
      <li>Problem Solving</li>
    </ul>
  </div>
</body>
</html>`
  }
];

export default function CodePlaygroundPage() {
  const [activeTab, setActiveTab] = useState('playground');
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES[0]);
  const [userCode, setUserCode] = useState(CHALLENGES[0].code);
  const [showSolution, setShowSolution] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  const handleChallengeSelect = (challengeId: string) => {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
      setUserCode(challenge.code);
      setShowSolution(false);
    }
  };
  
  const filteredChallenges = difficultyFilter === 'all' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.difficulty === difficultyFilter);
  
  return (
    <div className="container mx-auto p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
            Interactive Code Playground
          </h1>
          <p className="text-xl mt-4 text-gray-200">
            Learn to code with our interactive playground and AI-assisted learning
          </p>
        </div>
        
        <Tabs defaultValue="playground" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="playground" className="flex items-center gap-2">
                <Code size={16} />
                <span className="hidden sm:inline">Playground</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <GraduationCap size={16} />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span className="hidden sm:inline">Learn</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="playground" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-end mb-4">
                <CodeEnvironmentSetup />
              </div>
              <div className="rounded-xl border bg-card shadow-sm h-[600px]">
                <CodeEditor />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Coding Challenges</CardTitle>
                    <CardDescription>
                      Select a challenge to test your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      {filteredChallenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedChallenge.id === challenge.id
                              ? 'bg-primary/20 border border-primary/40'
                              : 'hover:bg-gray-800/50 bg-gray-800/30'
                          }`}
                          onClick={() => handleChallengeSelect(challenge.id)}
                        >
                          <h3 className="font-medium">{challenge.title}</h3>
                          <div className="flex items-center text-xs mt-1 text-gray-400">
                            <span className="capitalize">{challenge.difficulty}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{challenge.language}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {selectedChallenge && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Hint</AlertTitle>
                    <AlertDescription>{selectedChallenge.hint}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedChallenge.title}</CardTitle>
                    <CardDescription>{selectedChallenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    {showSolution ? (
                      <div className="h-full rounded-xl border bg-card shadow-sm">
                        <CodeEditor 
                          initialLanguage={selectedChallenge.language as any} 
                          readOnly={true}
                          onCodeChange={(code) => {}}
                        />
                      </div>
                    ) : (
                      <div className="h-full rounded-xl border bg-card shadow-sm">
                        <CodeEditor 
                          initialLanguage={selectedChallenge.language as any} 
                          onCodeChange={(code) => setUserCode(code)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Learning Resources
                  </CardTitle>
                  <CardDescription>
                    Explore tutorials, guides, and interactive lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Getting Started with Coding</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">Learn the basics of programming with our beginner-friendly introduction course.</p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-xs text-gray-400">Coming soon</p>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-900/40 to-blue-900/40 border-green-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Web Development Fundamentals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">Explore HTML, CSS, and JavaScript to build your first web pages and applications.</p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-xs text-gray-400">Coming soon</p>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg">AI and Machine Learning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">Discover the exciting world of AI and how to build your first machine learning models.</p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-xs text-gray-400">Coming soon</p>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center p-6 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <Cpu className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h3 className="text-xl font-medium text-white">AI Learning Assistant</h3>
                <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
                  Our AI tutor is being trained to provide personalized coding guidance,
                  answer your questions, and help you understand programming concepts.
                  Check back soon for this exciting feature!
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}