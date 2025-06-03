import React from 'react';
import CodePlaygroundComponent from '../components/ai/code-playground';
import { PageTransition } from '../components/animations/page-transition';

const CodePlayground: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <CodePlaygroundComponent />
      </div>
    </PageTransition>
  );
};

export default CodePlayground;