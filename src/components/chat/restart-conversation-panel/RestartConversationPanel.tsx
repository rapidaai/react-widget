import { Button, ButtonSet } from "@carbon/react";
import "./restart-conversation-panel.scss";

export interface RestartConversationPanelProps {
  isRestarting: boolean;
  onCancel: () => unknown;
  onConfirm: () => unknown;
}

export function RestartConversationPanel({
  isRestarting,
  onCancel,
  onConfirm,
}: RestartConversationPanelProps) {
  return (
    <section
      className="rapida-restart-conversation"
      aria-labelledby="rapida-restart-conversation-title"
    >
      <div className="rapida-restart-conversation__content">
        <h2 id="rapida-restart-conversation-title">
          Start a new conversation?
        </h2>
        <p>
          This will end the current conversation and clear its messages from the
          chat window.
        </p>
      </div>
      <ButtonSet className="rapida-restart-conversation__actions" fluid>
        <Button
          kind="secondary"
          disabled={isRestarting}
          onClick={() => void onCancel()}
        >
          Cancel
        </Button>
        <Button
          kind="danger"
          aria-label={isRestarting ? "Restarting…" : "Restart conversation"}
          disabled={isRestarting}
          onClick={() => void onConfirm()}
        >
          {isRestarting ? "Restarting…" : "Restart conversation"}
        </Button>
      </ButtonSet>
    </section>
  );
}
