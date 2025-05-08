import Image from "next/image";
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
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={24}
                className="dark:invert"
                priority
              />
              <div className="h-8 w-px bg-indigo-400 dark:bg-indigo-600"></div>
              <h1 className="text-xl font-bold">HSR Analytics</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="hover:text-indigo-200 transition">Dashboard</a>
              <a href="#" className="hover:text-indigo-200 transition">Characters</a>
              <a href="#" className="hover:text-indigo-200 transition">Analytics</a>
              <a href="#" className="hover:text-indigo-200 transition">About</a>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Honkai: Star Rail In-App Purchase Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Comprehensive data analysis of value metrics for in-game purchases</p>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Price Analysis</h3>
            <p className="text-base">Cost comparison across different purchase options</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Oneiric Shard Value</h3>
            <p className="text-base">Shards per dollar and efficiency metrics</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Roll Efficiency</h3>
            <p className="text-base">Number of rolls per dollar spent</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Purchase Comparison</h3>
            <p className="text-base">Best value in-app purchases</p>
          </div>
        </div>
        
        {/* Tableau Dashboard */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="tableauPlaceholder" id="viz1746724077988" style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '75%' }}>
            <noscript>
              <a href="#">
                <img 
                  alt="Honkai: Star Rail In-App Purchase Analysis" 
                  src="https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1_rss.png" 
                  style={{ border: 'none', width: '100%' }} 
                />
              </a>
            </noscript>
            <object className="tableauViz" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%' }}>
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
            </object>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Value Metrics</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Shard-to-Price Ratio: Analyzing which packages provide the most oneiric shards per dollar</li>
                <li>Roll Efficiency: Measuring which purchases convert to the highest number of gacha pulls</li>
                <li>Bonus Analysis: Comparison of base vs. bonus shards in special offers</li>
                <li>Bundle Value: Evaluating the total value of limited-time bundles</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Purchase Recommendations</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Monthly Pass Analysis: Long-term value comparison with one-time purchases</li>
                <li>First-Time Bonus Impact: How first-purchase bonuses affect overall value</li>
                <li>Special Event Value: Limited-time offers during game events</li>
                <li>F2P vs. Spending: Return on investment for different spending tiers</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Data analysis for Honkai: Star Rail. Not affiliated with HoYoverse.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}