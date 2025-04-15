import React from 'react';
import { Helmet } from 'react-helmet';
import { CanvaIntegration } from '@/components/canva/canva-integration';

const CanvaIntegrationPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Canva Integration | NURD</title>
      </Helmet>
      
      <div className="min-h-screen py-8">
        <CanvaIntegration />
      </div>
    </>
  );
};

export default CanvaIntegrationPage;