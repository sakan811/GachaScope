import React from 'react';
import { useTableauDashboard } from '../hooks/useTableauDashboard';

const Dashboard = () => {
  useTableauDashboard();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <div id="viz1746727019510" className="w-full h-full" style={{ position: 'relative' }}>
        <div className="flex items-center justify-center p-10 text-gray-500">
          <p>Loading dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
