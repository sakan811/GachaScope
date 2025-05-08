"use client"
import { useEffect } from "react";
import { createParams, createNoscriptFallback, loadScript } from './tableauUtils';
import Script from 'next/script';

const TABLEAU_VIZ_SCRIPT = "https://public.tableau.com/javascripts/api/viz_v1.js";
const TABLEAU_VIZ_ID = "viz1746727019510";
const DASHBOARD_WIDTH = "1366px";
const DASHBOARD_HEIGHT = "818px";


export default function Home() {
  useEffect(() => {
    const initViz = () => {
      const divElement = document.getElementById(TABLEAU_VIZ_ID);
      if (!divElement) {
        console.error(`Element with ID ${TABLEAU_VIZ_ID} not found.`);
        return;
      }

      while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
      }

      divElement.className = 'tableauPlaceholder';
      divElement.style.position = 'relative';

      const vizElement = document.createElement('object');
      vizElement.className = 'tableauViz';
      vizElement.style.width = DASHBOARD_WIDTH;
      vizElement.style.height = DASHBOARD_HEIGHT;

      createParams(vizElement);
      divElement.appendChild(createNoscriptFallback());
      divElement.appendChild(vizElement);
    };

    loadScript(TABLEAU_VIZ_SCRIPT, initViz);

    return () => {
      const script = document.querySelector(`script[src="${TABLEAU_VIZ_SCRIPT}"]`);
      if (script) {
        script.remove();
      }
      const divElement = document.getElementById(TABLEAU_VIZ_ID);
      if (divElement) {
        while (divElement.firstChild) {
          divElement.removeChild(divElement.firstChild);
        }
      }
    };
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="w-full bg-indigo-700 dark:bg-indigo-900 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-px bg-indigo-400 dark:bg-indigo-600"></div>
              <h1 className="text-xl font-bold">Honkai: Star Rail In-App Purchase Analysis</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Honkai: Star Rail In-App Purchase Analysis Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive data analysis of value metrics for in-game purchases</p>
        </div>
        
        {/* Tableau Dashboard */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <div id="viz1746727019510" className="w-full h-full" style={{position: 'relative'}}>
            {/* Tableau viz will be loaded here */}
            <div className="flex items-center justify-center p-10 text-gray-500">
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>

      <Script
        src={TABLEAU_VIZ_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => console.log('Script loaded successfully.')}
        onError={(e) => console.error('Failed to load the script.', e)}
      />
    </div>
  );
}
