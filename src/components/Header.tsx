import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-indigo-700 dark:bg-indigo-900 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-px bg-indigo-400 dark:bg-indigo-600"></div>
            <h1 className="text-xl font-bold">
              Honkai: Star Rail In-App Purchase Analysis
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
