import React from 'react';
import { render, screen } from '@testing-library/react';
import { EnvironmentContext, EnvironmentProvider } from '@/contexts/environment-context';

const Consumer: React.FC = () => {
  const ctx = React.useContext(EnvironmentContext);
  return (
    <div>
      <span data-testid="assistant-id">{ctx.assistantId ?? ''}</span>
      <span data-testid="api-base">{ctx.apiBase ?? ''}</span>
      <span data-testid="user-name">{ctx.user.name}</span>
      <span data-testid="user-id">{ctx.user.user_id}</span>
      <span data-testid="debug">{String(ctx.debug)}</span>
      <span data-testid="language">{ctx.language}</span>
      <span data-testid="theme-color">{ctx.theme.color}</span>
    </div>
  );
};

describe('EnvironmentProvider', () => {
  beforeEach(() => {
    window.chatbotConfig = {
      assistant_id: 'asst-xyz',
      api_base: 'https://assistant.example.com',
      token: 'tok-123',
      user: { name: 'Alice', user_id: 'alice-001' },
      debug: false,
      language: 'en',
      theme: { color: '#ff0000' },
    } as any;
  });

  it('provides chatbotConfig values to consumers', () => {
    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>
    );

    expect(screen.getByTestId('assistant-id')).toHaveTextContent('asst-xyz');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Alice');
    expect(screen.getByTestId('user-id')).toHaveTextContent('alice-001');
    expect(screen.getByTestId('theme-color')).toHaveTextContent('#ff0000');
  });

  it('falls back to default user name "Guest" when not set', () => {
    window.chatbotConfig = { token: 'tok-123' } as any;

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>
    );

    expect(screen.getByTestId('user-name')).toHaveTextContent('Guest');
  });

  it('falls back to English language when not set', () => {
    window.chatbotConfig = { token: 'tok-123' } as any;
    // Ensure the HTML lang attribute is set so the observer picks it up
    document.documentElement.lang = 'en';

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');
  });

  it('falls back to default theme color when not set', () => {
    window.chatbotConfig = { token: 'tok-123' } as any;

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>
    );

    expect(screen.getByTestId('theme-color')).toHaveTextContent('#2663eb');
  });

  it('generates and persists a user_id when none is provided', () => {
    window.chatbotConfig = { token: 'tok-123', user: { name: 'Bob' } } as any;
    localStorage.clear();

    render(
      <EnvironmentProvider>
        <Consumer />
      </EnvironmentProvider>
    );

    const userId = screen.getByTestId('user-id').textContent!;
    expect(userId).toBeTruthy();
    expect(userId).toMatch(/^web_agent_/);
  });
});
