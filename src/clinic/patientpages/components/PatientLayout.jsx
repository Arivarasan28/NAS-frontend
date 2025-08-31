import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientSidebar from './PatientSidebar';

const PatientLayout = () => {
  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
