import React from 'react';
import ReceptionistSidebar from './ReceptionistSidebar';

const ReceptionistLayout = ({ children }) => {
  return (
    <div className="flex">
      <ReceptionistSidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ReceptionistLayout;
