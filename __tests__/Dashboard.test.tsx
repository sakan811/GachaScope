import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/Dashboard';
import { describe, it, expect } from 'vitest';

describe('Dashboard Component', () => {
  it('renders the loading message initially', () => {
    render(<Dashboard />);
    const loadingMessage = screen.getByText('Loading dashboard...');
    expect(loadingMessage).not.toBeNull(); // Standard assertion
  });
});

