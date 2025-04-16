import React from 'react';
import CodeToolsComponent from '../components/ai/code-tools';
import { PageTransition } from '../components/animations/page-transition';

const CodeTools: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <CodeToolsComponent />
      </div>
    </PageTransition>
  );
};

export default CodeTools;