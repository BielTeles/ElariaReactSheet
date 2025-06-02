import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Elaria RPG header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Elaria RPG/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders Sistema de Fichas subtitle', () => {
  render(<App />);
  const subtitleElement = screen.getByText(/Sistema de Fichas/i);
  expect(subtitleElement).toBeInTheDocument();
});

test('renders main content container', () => {
  render(<App />);
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();
});
