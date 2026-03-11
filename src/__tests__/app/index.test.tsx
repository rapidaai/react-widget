import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock @rapidaai/react before importing App
jest.mock('@rapidaai/react', () => {
  const mockVoiceAgent = { getAssistant: jest.fn() };
  class MockVoiceAgent {
    getAssistant = mockVoiceAgent.getAssistant;
  }
  return {
    VoiceAgent: MockVoiceAgent,
    ConnectionConfig: {
      DefaultConnectionConfig: jest.fn(() => ({
        withCustomEndpoint: jest.fn().mockReturnThis(),
      })),
      WithWebpluginClient: jest.fn(() => ({})),
    },
    AgentConfig: jest.fn(),
    InputOptions: jest.fn(),
    Channel: { Audio: 'audio', Text: 'text' },
  };
});

// Mock WebPluginChat so we don't render the whole tree
jest.mock('@/app/pages/web-plugin-chat', () => ({
  WebPluginChat: ({ voiceAgent }: any) => (
    <div data-testid="web-plugin-chat" data-has-agent={!!voiceAgent} />
  ),
}));

import { App } from '@/app';
import { EnvironmentProvider } from '@/contexts/environment-context';

const renderWithEnv = (ui: React.ReactElement) =>
  render(<EnvironmentProvider>{ui}</EnvironmentProvider>);

describe('App', () => {
  it('renders WebPluginChat when token and assistantId are present', () => {
    window.chatbotConfig = {
      assistant_id: 'asst-001',
      api_base: 'https://api.test.com',
      token: 'tok-abc',
      user: { name: 'User', user_id: 'u-1' },
    } as any;

    renderWithEnv(<App />);

    expect(screen.getByTestId('web-plugin-chat')).toBeInTheDocument();
    expect(screen.getByTestId('web-plugin-chat').dataset.hasAgent).toBe('true');
  });

  it('does not render WebPluginChat when token is missing', () => {
    window.chatbotConfig = {
      assistant_id: 'asst-001',
      api_base: 'https://api.test.com',
      user: { name: 'User', user_id: 'u-1' },
    } as any;

    renderWithEnv(<App />);

    expect(screen.queryByTestId('web-plugin-chat')).not.toBeInTheDocument();
  });

  it('does not render WebPluginChat when assistantId is missing', () => {
    window.chatbotConfig = {
      api_base: 'https://api.test.com',
      token: 'tok-abc',
      user: { name: 'User', user_id: 'u-1' },
    } as any;

    renderWithEnv(<App />);

    expect(screen.queryByTestId('web-plugin-chat')).not.toBeInTheDocument();
  });
});
