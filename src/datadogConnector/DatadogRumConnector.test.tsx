import React from 'react'
import { render } from '@testing-library/react'
import DatadogRumConnector from './DatadogRumConnector'
import { before } from 'node:test';

describe('DatadogRumConnector', () => {
  // Clear environment variables before each test
  before(() => {
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID;
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN;
    delete process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE;
  });
  it('should render without crashing when no env vars are set', () => {
    const { container } = render(<DatadogRumConnector />);
    expect(container.innerHTML).toBe('')
  });
  
  // Mock environment variables
  before(() => {
    process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN = 'test'
    process.env.NEXT_PUBLIC_DATADOG_RUM_SERVICE = 'test'
  });
  it('should render without crashing with env vars set', () => {
    const { container } = render(<DatadogRumConnector />);
    expect(container.innerHTML).toBe('')
  });
});