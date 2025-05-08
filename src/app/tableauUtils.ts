const NAMESPACE_XHTML = 'http://www.w3.org/1999/xhtml';
const NOSCRIPT_ALT_TEXT = 'Fallback image for Tableau dashboard';

const PARAMS = [
  { name: 'host_url', value: 'https%3A%2F%2Fpublic.tableau.com%2F' },
  { name: 'embed_code_version', value: '3' },
  { name: 'site_root', value: '' },
  { name: 'name', value: 'Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis' },
  { name: 'tabs', value: 'yes' },
  { name: 'toolbar', value: 'yes' },
  { name: 'static_image', value: 'https://public.tableau.com/static/images/Ho/Honkai_StarRailIn-AppPurchaseAnalysis/HonkaiStarRailIn-AppPurchaseAnalysis/1.png' },
  { name: 'animate_transition', value: 'yes' },
  { name: 'display_static_image', value: 'yes' },
  { name: 'display_spinner', value: 'yes' },
  { name: 'display_overlay', value: 'yes' },
  { name: 'display_count', value: 'yes' },
  { name: 'language', value: 'en-US' }
];

/**
 * Appends Tableau-specific parameters as <param> elements to the given HTML element.
 * @param vizElement - The HTML element to which the parameters will be appended.
 * Logs an error if the provided element is null or undefined.
 */
export function createParams(vizElement: HTMLElement | null) {
  if (!vizElement) {
    console.error('createParams: Provided element is null or undefined.');
    return;
  }

  PARAMS.forEach(param => {
    const paramElement = document.createElementNS(NAMESPACE_XHTML, 'param');
    paramElement.setAttribute('name', param.name);
    paramElement.setAttribute('value', param.value);
    vizElement.appendChild(paramElement);
  });
}

/**
 * Creates a <noscript> fallback element containing a link and an image for accessibility.
 * @returns The created <noscript> element.
 */
export function createNoscriptFallback() {
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

/**
 * Dynamically loads an external script into the document.
 * @param src - The URL of the script to load.
 * @param onLoad - A callback function to execute once the script is successfully loaded.
 * Logs an error if the script source is invalid or if the script fails to load.
 */
export function loadScript(src: string, onLoad: () => void) {
  if (!src) {
    console.error('loadScript: Provided script source is invalid.');
    return;
  }

  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.body.appendChild(script);
  } else {
    onLoad();
  }
}
