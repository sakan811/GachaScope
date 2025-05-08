"use client"
import { useEffect } from "react";

const TABLEAU_VIZ_SCRIPT = "https://public.tableau.com/javascripts/api/viz_v1.js";
const TABLEAU_VIZ_ID = "viz1746727019510";
const DASHBOARD_NAME = "Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis";
const DASHBOARD_IMAGE = "https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1.png";
const DASHBOARD_WIDTH = "1366px";
const DASHBOARD_HEIGHT = "818px";
const NAMESPACE_XHTML = 'http://www.w3.org/1999/xhtml';
const NOSCRIPT_ALT_TEXT = 'Fallback image for Tableau dashboard';

const PARAMS = [
  { name: 'host_url', value: 'https%3A%2F%2Fpublic.tableau.com%2F' },
  { name: 'embed_code_version', value: '3' },
  { name: 'site_root', value: '' },
  { name: 'name', value: DASHBOARD_NAME },
  { name: 'tabs', value: 'yes' },
  { name: 'toolbar', value: 'yes' },
  { name: 'static_image', value: DASHBOARD_IMAGE },
  { name: 'animate_transition', value: 'yes' },
  { name: 'display_static_image', value: 'yes' },
  { name: 'display_spinner', value: 'yes' },
  { name: 'display_overlay', value: 'yes' },
  { name: 'display_count', value: 'yes' },
  { name: 'language', value: 'en-US' }
];

export default function Home() {
  useEffect(() => {
    function createParams(vizElement: HTMLElement) {
      PARAMS.forEach(param => {
        const paramElement = document.createElementNS(NAMESPACE_XHTML, 'param');
        paramElement.setAttribute('name', param.name);
        paramElement.setAttribute('value', param.value);
        vizElement.appendChild(paramElement);
      });
    }

    function createNoscriptFallback() {
      const noscript = document.createElement('noscript');
      const fallbackLink = document.createElement('a');
      fallbackLink.href = '#';
      const fallbackImg = document.createElement('img');
      fallbackImg.alt = NOSCRIPT_ALT_TEXT;
      fallbackImg.src = 'https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1_rss.png';
      fallbackImg.style.border = 'none';
      fallbackLink.appendChild(fallbackImg);
      noscript.appendChild(fallbackLink);
      return noscript;
    }

    function loadScript(src: string, onLoad: () => void) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = onLoad;
        document.body.appendChild(script);
      } else {
        onLoad();
      }
    }

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

      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = TABLEAU_VIZ_SCRIPT;
      scriptElement.onload = () => console.log('Script loaded successfully.');
      scriptElement.onerror = () => console.error('Failed to load the script.');
      if (vizElement.parentNode) {
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
      }
    };

    loadScript(TABLEAU_VIZ_SCRIPT, initViz);

    return () => {
      const script = document.querySelector(`script[src="${TABLEAU_VIZ_SCRIPT}"]`);
      if (script) {
        script.remove();
      }
      const divElement = document.getElementById(TABLEAU_VIZ_ID);
      if (divElement) {
        divElement.innerHTML = '';
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
    </div>
  );
}

export { createParams, createNoscriptFallback, loadScript };
