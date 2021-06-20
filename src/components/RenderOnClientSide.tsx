import React, { useEffect, useState } from 'react';

const RenderOnClientSide: React.FC = ({ children }) => {
  const [m, setM] = useState(false);
  useEffect(() => {
    setM(true);
  }, []);

  return m ? <>{children}</> : null;
};

export default RenderOnClientSide;
