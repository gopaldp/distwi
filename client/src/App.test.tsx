import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock react-router-dom to avoid ESM import issues in Jest environment
jest.mock('react-router-dom', () => ({
  // Simple stubs that just render children or act as placeholders
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
  Navigate: () => null,
}));

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
