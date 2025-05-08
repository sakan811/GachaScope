import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/Dashboard';
import { describe, it } from 'vitest';

describe('Dashboard Component', () => {
  it('renders the loading message initially', () => {
    render(<Dashboard />);
    const loadingMessage = screen.getByText('Loading dashboard...');
    expect(loadingMessage).toBeTruthy();
  });
});
function expect(loadingMessage: HTMLElement) {
    throw new Error('Function not implemented.');
}

