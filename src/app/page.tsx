"use client"
import { useEffect } from "react";

export default function Home() {
  // Load Tableau script when component mounts
  useEffect(() => {
    const loadTableau = () => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      scriptElement.async = true;
      document.body.appendChild(scriptElement);
      
      return () => {
        document.body.removeChild(scriptElement);
      };
    };
    
    const cleanup = loadTableau();
    
    return cleanup;
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="w-full bg-indigo-700 dark:bg-indigo-900 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-px bg-indigo-400 dark:bg-indigo-600"></div>
              <h1 className="text-xl font-bold">Honkai: Star Rail In-App Purchase Analysis</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Honkai: Star Rail In-App Purchase Analysis Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Comprehensive data analysis of value metrics for in-game purchases</p>
        </div>
        
        {/* Tableau Dashboard */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="tableauPlaceholder" id="viz1746724077988" style={{ position: 'relative', width: '100%' }}>
            <noscript>
              <a href="#">
                <img 
                  alt="Honkai: Star Rail In-App Purchase Analysis" 
                  src="https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1_rss.png" 
                  style={{ border: 'none', width: '100%' }} 
                />
              </a>
            </noscript>
            <object className="tableauViz" style={{ width: '100%', height: '700px', display: 'block' }}>
              <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
              <param name="embed_code_version" value="3" />
              <param name="site_root" value="" />
              <param name="name" value="Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis" />
              <param name="tabs" value="no" />
              <param name="toolbar" value="yes" />
              <param name="static_image" value="https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1.png" />
              <param name="animate_transition" value="yes" />
              <param name="display_static_image" value="yes" />
              <param name="display_spinner" value="yes" />
              <param name="display_overlay" value="yes" />
              <param name="display_count" value="yes" />
              <param name="language" value="en-US" />
              <param name="filter" value="" />
              <param name="device" value="desktop" />
              <param name="render" value="true" />
            </object>
          </div>
        </div>
      </main>
    </div>
  );
}