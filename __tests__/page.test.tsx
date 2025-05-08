import { describe, it, expect, vi } from 'vitest';
import { createParams, createNoscriptFallback, loadScript } from '../src/app/tableauUtils';

describe('createParams', () => {
  it('should append param elements to the given element', () => {
    const mockElement = document.createElement('div');
    createParams(mockElement);

    const params = mockElement.querySelectorAll('param');
    expect(params.length).toBeGreaterThan(0);
    expect(params[0].getAttribute('name')).toBeDefined();
    expect(params[0].getAttribute('value')).toBeDefined();
  });

  it('should log an error if the provided element is null', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    createParams(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith('createParams: Provided element is null or undefined.');
    consoleErrorSpy.mockRestore();
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

  it('should log an error if the provided script source is invalid', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    loadScript('', vi.fn());
    expect(consoleErrorSpy).toHaveBeenCalledWith('loadScript: Provided script source is invalid.');
    consoleErrorSpy.mockRestore();
  });

  it('should log an error if the script fails to load', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    loadScript('https://invalid-url.com/script.js', vi.fn());

    const script = document.querySelector('script[src="https://invalid-url.com/script.js"]');
    expect(script).toBeDefined();

    // Simulate script load error
    script?.dispatchEvent(new Event('error'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load script: https://invalid-url.com/script.js');
    consoleErrorSpy.mockRestore();
  });
});
