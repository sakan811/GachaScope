import { describe, it, expect, vi } from 'vitest';
import { createParams, createNoscriptFallback, loadScript } from '../src/app/page';

describe('createParams', () => {
  it('should append param elements to the given element', () => {
    const mockElement = document.createElement('div');
    createParams(mockElement);

    const params = mockElement.querySelectorAll('param');
    expect(params.length).toBeGreaterThan(0);
    expect(params[0].getAttribute('name')).toBeDefined();
    expect(params[0].getAttribute('value')).toBeDefined();
  });
});

describe('createNoscriptFallback', () => {
  it('should create a noscript element with a fallback image', () => {
    const noscript = createNoscriptFallback();

    expect(noscript.tagName).toBe('NOSCRIPT');
    const img = noscript.querySelector('img');
    expect(img).toBeDefined();
    expect(img?.getAttribute('alt')).toBe('Fallback image for Tableau dashboard');
  });
});

describe('loadScript', () => {
  it('should append a script element if not already present', () => {
    const mockOnLoad = vi.fn();
    loadScript('https://example.com/script.js', mockOnLoad);

    const script = document.querySelector('script[src="https://example.com/script.js"]');
    expect(script).toBeDefined();
    expect(script?.getAttribute('src')).toBe('https://example.com/script.js');
  });

  it('should call onLoad immediately if script is already present', () => {
    const mockOnLoad = vi.fn();
    const existingScript = document.createElement('script');
    existingScript.src = 'https://example.com/script.js';
    document.body.appendChild(existingScript);

    loadScript('https://example.com/script.js', mockOnLoad);
    expect(mockOnLoad).toHaveBeenCalled();
  });
});
