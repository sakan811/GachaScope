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

export function createParams(vizElement: HTMLElement) {
  PARAMS.forEach(param => {
    const paramElement = document.createElementNS(NAMESPACE_XHTML, 'param');
    paramElement.setAttribute('name', param.name);
    paramElement.setAttribute('value', param.value);
    vizElement.appendChild(paramElement);
  });
}

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

export function loadScript(src: string, onLoad: () => void) {
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
