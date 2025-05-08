import { describe, it, expect, vi } from 'vitest';
import { createNoscriptFallback, loadScript } from '../src/app/tableauUtils';

describe('createNoscriptFallback', () => {
  it('should create a noscript element with a fallback image and link', () => {
    const noscript = createNoscriptFallback();
    const link = noscript.querySelector('a');
    const img = link?.querySelector('img');

    expect(noscript.tagName).toBe('NOSCRIPT');
    expect(link).not.toBeNull();
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toBeDefined();
    expect(img?.getAttribute('src')).toBeDefined();
  });
});

describe('loadScript', () => {
  it('should append a script element to the document body', () => {
    const mockOnLoad = vi.fn();
    loadScript('https://example.com/script.js', mockOnLoad);

    const script = document.querySelector('script[src="https://example.com/script.js"]');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toBe('https://example.com/script.js');

    // Simulate script load
    script?.dispatchEvent(new Event('load'));
    expect(mockOnLoad).toHaveBeenCalled();
  });

  it('should not append a script if it already exists', () => {
    const mockOnLoad = vi.fn();
    document.body.innerHTML = '<script src="https://example.com/script.js"></script>';
    loadScript('https://example.com/script.js', mockOnLoad);

    const scripts = document.querySelectorAll('script[src="https://example.com/script.js"]');
    expect(scripts.length).toBe(1);
  });

  it('should log an error if the script source is invalid', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    loadScript('', () => {});
    expect(consoleErrorSpy).toHaveBeenCalledWith('loadScript: Provided script source is invalid.');
    consoleErrorSpy.mockRestore();
  });
});
