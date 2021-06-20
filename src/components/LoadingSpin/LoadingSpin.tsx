import { useGloading } from '@/utils/Gloading';
import React from 'react';
import './styles.scss';

const LoadingSpin: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div className="loading-spin-root" style={{ opacity: loading ? 1 : 0 }}>
      <div className="loading-spin">
        <div className="circle"></div>
        <div className="inner">♪(´▽｀)</div>
      </div>
    </div>
  );
};

export default LoadingSpin;
