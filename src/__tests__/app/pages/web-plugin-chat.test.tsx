import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('@rapidaai/react', () => ({
  VoiceAgent: jest.fn(),
  AssistantWebpluginDeployment: jest.fn(),
}));

// Mock ChatComponent to avoid rendering the full tree
jest.mock('@/app/pages/v3', () => ({
  ChatComponent: ({ deployment, voiceAgent }: any) => (
    <div
      data-testid="chat-component"
      data-deployment-name={deployment?.getName?.()}
      data-has-agent={!!voiceAgent}
    />
  ),
}));

import { WebPluginChat } from '@/app/pages/web-plugin-chat';

const makeDeployment = (name = 'TestBot') => ({
  getName: () => name,
  getGreeting: () => 'Hello!',
  getSuggestionList: () => [],
});

const makeVoiceAgent = (deployment: any) => ({
  getAssistant: jest.fn().mockResolvedValue({
    getSuccess: () => true,
    getData: () => ({
      getWebplugindeployment: () => deployment,
    }),
  }),
});

describe('WebPluginChat', () => {
  it('renders ChatComponent after loading deployment', async () => {
    const deployment = makeDeployment('SupportBot');
    const voiceAgent = makeVoiceAgent(deployment) as any;

    render(<WebPluginChat voiceAgent={voiceAgent} />);

    await waitFor(() =>
      expect(screen.getByTestId('chat-component')).toBeInTheDocument()
    );

    expect(screen.getByTestId('chat-component').dataset.deploymentName).toBe('SupportBot');
    expect(screen.getByTestId('chat-component').dataset.hasAgent).toBe('true');
  });

  it('renders nothing when getAssistant returns no deployment', async () => {
    const voiceAgent = {
      getAssistant: jest.fn().mockResolvedValue({
        getSuccess: () => true,
        getData: () => ({ getWebplugindeployment: () => undefined }),
      }),
    } as any;

    const { container } = render(<WebPluginChat voiceAgent={voiceAgent} />);

    await waitFor(() => expect(voiceAgent.getAssistant).toHaveBeenCalled());

    // Nothing should be rendered when deployment is missing
    expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
  });

  it('renders nothing when getAssistant call fails', async () => {
    const voiceAgent = {
      getAssistant: jest.fn().mockRejectedValue(new Error('Network error')),
    } as any;

    render(<WebPluginChat voiceAgent={voiceAgent} />);

    await waitFor(() => expect(voiceAgent.getAssistant).toHaveBeenCalled());

    expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
  });

  it('renders nothing when response success is false', async () => {
    const voiceAgent = {
      getAssistant: jest.fn().mockResolvedValue({
        getSuccess: () => false,
        getData: () => null,
      }),
    } as any;

    render(<WebPluginChat voiceAgent={voiceAgent} />);

    await waitFor(() => expect(voiceAgent.getAssistant).toHaveBeenCalled());

    expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
  });

  it('calls getAssistant with the provided voiceAgent', async () => {
    const deployment = makeDeployment();
    const voiceAgent = makeVoiceAgent(deployment) as any;

    render(<WebPluginChat voiceAgent={voiceAgent} />);

    await waitFor(() => expect(voiceAgent.getAssistant).toHaveBeenCalledTimes(1));
  });
});
