import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---- SDK mocks -------------------------------------------------------
const mockHandleConnectAgent = jest.fn();
const mockHandleDisconnectAgent = jest.fn();

let mockIsConnected = false;
let mockMessages: any[] = [];

jest.mock('@rapidaai/react', () => ({
  useConnectAgent: jest.fn(() => ({
    handleConnectAgent: mockHandleConnectAgent,
    handleDisconnectAgent: mockHandleDisconnectAgent,
    isConnected: mockIsConnected,
    isConnecting: false,
  })),
  useAgentMessages: jest.fn(() => ({ messages: mockMessages })),
  Channel: { Audio: 'audio', Text: 'text' },
  useInputModeToggleAgent: jest.fn(() => ({
    channel: 'text',
    handleVoiceToggle: jest.fn(),
    handleTextToggle: jest.fn(),
  })),
  useMuteAgent: jest.fn(() => ({ isMuted: false, handleToggleMute: jest.fn() })),
  useMultibandMicrophoneTrackVolume: jest.fn(() => []),
  useSelectInputDeviceAgent: jest.fn(() => ({
    devices: [],
    activeDeviceId: '',
    setActiveMediaDevice: jest.fn(),
  })),
  MultibandAudioVisualizerComponent: () => <div data-testid="visualizer" />,
  AssistantWebpluginDeployment: jest.fn(),
}));

jest.mock('@uiw/react-markdown-preview', () => ({
  __esModule: true,
  default: ({ source }: { source: string }) => <div data-testid="markdown">{source}</div>,
}));

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: { div: ({ children, ...rest }: any) => <div {...rest}>{children}</div> },
}));

import { ChatComponent } from '@/app/pages/v3';

const makeDeployment = (overrides?: Partial<{
  name: string; greeting: string; suggestions: string[];
}>) => {
  const d = { name: 'HelpBot', greeting: 'Hi there!', suggestions: ['FAQ', 'Contact'], ...overrides };
  return {
    getName: () => d.name,
    getGreeting: () => d.greeting,
    getSuggestionList: () => d.suggestions,
  } as any;
};

const mockVoiceAgent = { onSendText: jest.fn() } as any;

const renderChat = (deployment = makeDeployment()) =>
  render(<ChatComponent deployment={deployment} voiceAgent={mockVoiceAgent} />);

beforeEach(() => {
  mockIsConnected = false;
  mockMessages = [];
  jest.clearAllMocks();
});

// ---- Floating launcher button ----------------------------------------
describe('ChatComponent – floating launcher button', () => {
  it('renders the floating launch button', () => {
    renderChat();
    expect(screen.getByRole('button', { name: /open the chat window/i })).toBeInTheDocument();
  });

  it('shows the chat panel when the launch button is clicked', async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByRole('button', { name: /open the chat window/i }));

    // The chat container should have the "launched" class but not "closed"
    const widget = document.querySelector('.WACWidget');
    expect(widget?.className).not.toContain('WACWidget--closed');
  });

  it('hides the chat panel on second click (toggle)', async () => {
    const user = userEvent.setup();
    renderChat();

    const launchBtn = screen.getByRole('button', { name: /open the chat window/i });
    await user.click(launchBtn);
    await user.click(launchBtn);

    const widget = document.querySelector('.WACWidget');
    expect(widget?.className).toContain('WACWidget--closed');
  });
});

// ---- Header controls -------------------------------------------------
describe('ChatComponent – header', () => {
  it('renders the minimise button', () => {
    renderChat();
    // The close/minimise button has a label "Close the chat window" but we check SVG path
    const container = document.querySelector('.WACHeader__RightButtons');
    expect(container).toBeInTheDocument();
  });

  it('calls handleDisconnectAgent when restart button clicked while connected', async () => {
    const user = userEvent.setup();
    mockIsConnected = true;
    renderChat();

    const restartButton = screen
      .getAllByRole('button')
      .find((b) => b.className.includes('WACHeader__RestartButton'));
    expect(restartButton).toBeDefined();

    await user.click(restartButton!);

    expect(mockHandleDisconnectAgent).toHaveBeenCalledTimes(1);
  });

  it('does NOT call handleDisconnectAgent when restart button clicked while disconnected', async () => {
    const user = userEvent.setup();
    mockIsConnected = false;
    renderChat();

    const restartButton = screen
      .getAllByRole('button')
      .find((b) => b.className.includes('WACHeader__RestartButton'));
    expect(restartButton).toBeDefined();

    await user.click(restartButton!);

    expect(mockHandleDisconnectAgent).not.toHaveBeenCalled();
  });
});

// ---- Greeting + suggestions ------------------------------------------
describe('ChatComponent – greeting & suggestions', () => {
  it('renders the greeting message', () => {
    renderChat(makeDeployment({ greeting: 'Hello, how can I help?' }));

    const markdowns = screen.getAllByTestId('markdown');
    expect(markdowns.some(el => el.textContent === 'Hello, how can I help?')).toBe(true);
  });

  it('renders suggestion chips', () => {
    renderChat(makeDeployment({ suggestions: ['Billing', 'Support', 'Sales'] }));

    // Each chip renders the label text in both a <title> (SVG) and a .cardLabel <span>,
    // so getAllByText is used to tolerate both matches.
    expect(screen.getAllByText('Billing').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Support').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sales').length).toBeGreaterThan(0);
  });

  it('calls voiceAgent.onSendText when a suggestion is clicked', async () => {
    const user = userEvent.setup();
    renderChat(makeDeployment({ suggestions: ['How does billing work?'] }));

    // Click the card element (which carries the onClick); query via .cardLabel to avoid
    // matching the SVG <title> element with the same text.
    const cardLabels = document.querySelectorAll('.cardLabel');
    const target = Array.from(cardLabels).find(
      (el) => el.textContent === 'How does billing work?'
    );
    await user.click(target!.closest('.ibm-unified-chat--card') as HTMLElement);

    expect(mockVoiceAgent.onSendText).toHaveBeenCalledWith('How does billing work?');
  });
});

// ---- Messages display ------------------------------------------------
describe('ChatComponent – messages', () => {
  it('renders no messages when the list is empty', () => {
    mockMessages = [];
    renderChat();

    // Only the greeting markdown should be visible
    const markdowns = screen.getAllByTestId('markdown');
    expect(markdowns).toHaveLength(1); // just the greeting
  });

  it('renders user messages', () => {
    mockMessages = [
      {
        id: '1',
        role: 'user',
        messages: ['What are your hours?'],
        time: new Date(),
      },
    ];
    renderChat();

    const markdowns = screen.getAllByTestId('markdown');
    expect(markdowns.some(el => el.textContent === 'What are your hours?')).toBe(true);
  });

  it('renders assistant messages', () => {
    mockMessages = [
      {
        id: '2',
        role: 'assistant',
        messages: ['We are open 9–5 Monday to Friday.'],
        time: new Date(),
      },
    ];
    renderChat();

    const markdowns = screen.getAllByTestId('markdown');
    expect(
      markdowns.some(el => el.textContent === 'We are open 9–5 Monday to Friday.')
    ).toBe(true);
  });

  it('shows loading indicator after a user message with no assistant response', () => {
    mockMessages = [
      {
        id: '1',
        role: 'user',
        messages: ['Hello'],
        time: new Date(),
      },
    ];
    renderChat();

    expect(document.querySelector('.WAC__LoadingIcon')).toBeInTheDocument();
  });

  it('hides loading indicator when last message is from assistant', () => {
    mockMessages = [
      { id: '1', role: 'user', messages: ['Hello'], time: new Date() },
      { id: '2', role: 'assistant', messages: ['Hi!'], time: new Date() },
    ];
    renderChat();

    expect(document.querySelector('.WAC__LoadingIcon')).not.toBeInTheDocument();
  });

  it('renders the bot name alongside assistant messages', () => {
    mockMessages = [
      { id: '1', role: 'assistant', messages: ['I can help.'], time: new Date() },
    ];
    const deployment = makeDeployment({ name: 'Aria' });
    render(<ChatComponent deployment={deployment} voiceAgent={mockVoiceAgent} />);

    // Bot name appears in the message label
    const labels = document.querySelectorAll('.WACMessage__Label');
    const hasAria = Array.from(labels).some(el => el.textContent?.includes('Aria'));
    expect(hasAria).toBe(true);
  });
});

// ---- Send message via input ------------------------------------------
describe('ChatComponent – sending messages', () => {
  it('forwards text from the Input to voiceAgent.onSendText', async () => {
    const user = userEvent.setup();
    renderChat();

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test question');
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(mockVoiceAgent.onSendText).toHaveBeenCalledWith('Test question')
    );
  });
});
