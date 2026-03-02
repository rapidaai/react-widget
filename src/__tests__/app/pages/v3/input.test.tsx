import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---- SDK mocks -------------------------------------------------------
const mockHandleConnectAgent = jest.fn().mockResolvedValue(undefined);
const mockHandleDisconnectAgent = jest.fn().mockResolvedValue(undefined);
const mockHandleVoiceToggle = jest.fn().mockResolvedValue(undefined);
const mockHandleTextToggle = jest.fn().mockResolvedValue(undefined);
const mockHandleToggleMute = jest.fn().mockResolvedValue(undefined);
const mockSetActiveMediaDevice = jest.fn().mockResolvedValue(undefined);

let mockChannel = 'text';
let mockIsConnected = false;
let mockIsConnecting = false;
let mockIsMuted = false;
let mockDevices: MediaDeviceInfo[] = [];

jest.mock('@rapidaai/react', () => ({
  Channel: { Audio: 'audio', Text: 'text' },
  useConnectAgent: jest.fn(() => ({
    handleConnectAgent: mockHandleConnectAgent,
    handleDisconnectAgent: mockHandleDisconnectAgent,
    isConnected: mockIsConnected,
    isConnecting: mockIsConnecting,
  })),
  useInputModeToggleAgent: jest.fn(() => ({
    channel: mockChannel,
    handleVoiceToggle: mockHandleVoiceToggle,
    handleTextToggle: mockHandleTextToggle,
  })),
  useMuteAgent: jest.fn(() => ({
    isMuted: mockIsMuted,
    handleToggleMute: mockHandleToggleMute,
  })),
  useMultibandMicrophoneTrackVolume: jest.fn(() => []),
  useSelectInputDeviceAgent: jest.fn(() => ({
    devices: mockDevices,
    activeDeviceId: '',
    setActiveMediaDevice: mockSetActiveMediaDevice,
  })),
  MultibandAudioVisualizerComponent: () => <div data-testid="visualizer" />,
}));

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

import { Input } from '@/app/pages/v3/input';

const mockVoiceAgent = {} as any;

const renderInput = (props?: Partial<React.ComponentProps<typeof Input>>) =>
  render(
    <Input
      onSendMessage={jest.fn()}
      voiceAgent={mockVoiceAgent}
      {...props}
    />
  );

beforeEach(() => {
  mockChannel = 'text';
  mockIsConnected = false;
  mockIsConnecting = false;
  mockIsMuted = false;
  mockDevices = [];
  jest.clearAllMocks();
  // Restore mock implementations after clearAllMocks
  mockHandleConnectAgent.mockResolvedValue(undefined);
  mockHandleVoiceToggle.mockResolvedValue(undefined);
});

// ---- Text mode -------------------------------------------------------
describe('Input – text mode', () => {
  it('renders the textarea', () => {
    renderInput();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows voice/mic button when textarea is empty', () => {
    renderInput();
    expect(screen.getByLabelText(/start voice input/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send/i })).not.toBeInTheDocument();
  });

  it('shows send button when textarea has text', async () => {
    const user = userEvent.setup();
    renderInput();

    await user.type(screen.getByRole('textbox'), 'Hello');

    // send button appears (type="submit")
    const sendBtn = screen.getByRole('button', { name: '' });
    // The send button has no aria-label but is type="submit"
    const allButtons = screen.getAllByRole('button');
    const submitBtn = allButtons.find(
      (b) => b.getAttribute('type') === 'submit'
    );
    expect(submitBtn).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted with text', async () => {
    const onSendMessage = jest.fn();
    const user = userEvent.setup();
    renderInput({ onSendMessage });

    await user.type(screen.getByRole('textbox'), 'Hello world');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(onSendMessage).toHaveBeenCalledWith('Hello world'));
  });

  it('does not call onSendMessage when textarea is empty', async () => {
    const onSendMessage = jest.fn();
    const user = userEvent.setup();
    renderInput({ onSendMessage });

    await user.keyboard('{Enter}');

    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('clears textarea after successful submission', async () => {
    const user = userEvent.setup();
    renderInput();
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'Test message');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(textarea).toHaveValue(''));
  });

  it('disables voice button while connecting', () => {
    mockIsConnecting = true;
    renderInput();

    expect(screen.getByLabelText(/connecting/i)).toBeDisabled();
  });

  it('calls handleVoiceToggle and handleConnectAgent when voice button clicked (not connected)', async () => {
    const user = userEvent.setup();
    mockIsConnected = false;
    renderInput();

    await user.click(screen.getByLabelText(/start voice input/i));

    expect(mockHandleVoiceToggle).toHaveBeenCalledTimes(1);
    expect(mockHandleConnectAgent).toHaveBeenCalledTimes(1);
  });

  it('calls handleVoiceToggle but NOT handleConnectAgent when already connected', async () => {
    const user = userEvent.setup();
    mockIsConnected = true;
    renderInput();

    await user.click(screen.getByLabelText(/start voice input/i));

    expect(mockHandleVoiceToggle).toHaveBeenCalledTimes(1);
    expect(mockHandleConnectAgent).not.toHaveBeenCalled();
  });

  it('Shift+Enter inserts newline without submitting', async () => {
    const onSendMessage = jest.fn();
    const user = userEvent.setup();
    renderInput({ onSendMessage });

    await user.type(screen.getByRole('textbox'), 'line one');
    await user.keyboard('{Shift>}{Enter}{/Shift}');

    expect(onSendMessage).not.toHaveBeenCalled();
  });
});

// ---- Voice / audio mode ----------------------------------------------
describe('Input – audio mode (voice active)', () => {
  beforeEach(() => {
    mockChannel = 'audio';
  });

  it('renders the audio panel instead of the text form', () => {
    renderInput();

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByTestId('visualizer')).toBeInTheDocument();
  });

  it('shows mute button (mic on)', () => {
    mockIsMuted = false;
    renderInput();
    expect(screen.getByLabelText(/mute microphone/i)).toBeInTheDocument();
  });

  it('shows unmute button when muted', () => {
    mockIsMuted = true;
    renderInput();
    expect(screen.getByLabelText(/unmute microphone/i)).toBeInTheDocument();
  });

  it('calls handleToggleMute when mic button is clicked', async () => {
    const user = userEvent.setup();
    mockIsConnected = true;
    renderInput();

    await user.click(screen.getByLabelText(/mute microphone/i));

    expect(mockHandleToggleMute).toHaveBeenCalledTimes(1);
  });

  it('shows switch-to-text button', () => {
    renderInput();
    expect(screen.getByLabelText(/switch to text/i)).toBeInTheDocument();
  });

  it('calls handleTextToggle when switch-to-text button is clicked', async () => {
    const user = userEvent.setup();
    mockIsConnected = true;
    renderInput();

    await user.click(screen.getByLabelText(/switch to text/i));

    expect(mockHandleTextToggle).toHaveBeenCalledTimes(1);
  });

  it('shows stop button', () => {
    renderInput();
    expect(screen.getByLabelText(/stop voice/i)).toBeInTheDocument();
  });

  it('calls handleDisconnectAgent when stop button is clicked', async () => {
    const user = userEvent.setup();
    mockIsConnected = true;
    renderInput();

    await user.click(screen.getByLabelText(/stop voice/i));

    expect(mockHandleDisconnectAgent).toHaveBeenCalledTimes(1);
  });

  it('disables mic and stop buttons when not connected', () => {
    mockIsConnected = false;
    mockIsConnecting = false;
    renderInput();

    expect(screen.getByLabelText(/mute microphone/i)).toBeDisabled();
    expect(screen.getByLabelText(/switch to text/i)).toBeDisabled();
    expect(screen.getByLabelText(/stop voice/i)).toBeDisabled();
  });
});

// ---- Device selector flyout ------------------------------------------
describe('Input – device selector (audio mode)', () => {
  beforeEach(() => {
    mockChannel = 'audio';
    mockDevices = [
      { deviceId: 'dev-1', label: 'Built-in Mic', kind: 'audioinput', groupId: '' } as MediaDeviceInfo,
      { deviceId: 'dev-2', label: 'USB Microphone', kind: 'audioinput', groupId: '' } as MediaDeviceInfo,
    ];
  });

  it('shows device list on hover', async () => {
    renderInput();

    // Find the flyout wrapper div (parent of the trigger button)
    const trigger = screen.getByText(/select microphone/i);
    const flyoutWrapper = trigger.closest('div[style*="position"]') as HTMLElement;
    fireEvent.mouseEnter(flyoutWrapper);

    await waitFor(() => {
      expect(screen.getByText('Built-in Mic')).toBeInTheDocument();
      expect(screen.getByText('USB Microphone')).toBeInTheDocument();
    });
  });

  it('calls setActiveMediaDevice when a device is selected', async () => {
    const user = userEvent.setup();
    renderInput();

    const trigger = screen.getByText(/select microphone/i);
    const flyoutWrapper = trigger.closest('div[style*="position"]') as HTMLElement;
    fireEvent.mouseEnter(flyoutWrapper);

    await waitFor(() => screen.getByText('USB Microphone'));
    await user.click(screen.getByText('USB Microphone'));

    expect(mockSetActiveMediaDevice).toHaveBeenCalledWith('dev-2');
  });
});
