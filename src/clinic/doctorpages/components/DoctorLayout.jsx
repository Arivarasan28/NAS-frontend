import React from 'react';
import DoctorSidebar from './DoctorSidebar';
import AuthDebugger from '../../../components/AuthDebugger';

const DoctorLayout = ({ children }) => {
  return (
    <div className="flex">
      <DoctorSidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <AuthDebugger />
        {children}
      </div>
    </div>
  );
};

export default DoctorLayout;
