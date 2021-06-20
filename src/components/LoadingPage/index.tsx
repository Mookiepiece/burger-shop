import Gloading from '@/utils/Gloading';
import React, { useEffect } from 'react';

const LoadingPage: React.FC = () => {
  useEffect(() => {
    Gloading.lock();
    return () => {
      Gloading.unlock();
    };
  }, []);

  return null;
};

export default LoadingPage;
