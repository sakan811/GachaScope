import { useEffect } from 'react';
import { createParams, createNoscriptFallback, loadScript } from '../app/tableauUtils';

const TABLEAU_VIZ_SCRIPT = "https://public.tableau.com/javascripts/api/viz_v1.js";
const TABLEAU_VIZ_ID = "viz1746727019510";
const DASHBOARD_WIDTH = "1366px";
const DASHBOARD_HEIGHT = "818px";

export const useTableauDashboard = () => {
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
};
