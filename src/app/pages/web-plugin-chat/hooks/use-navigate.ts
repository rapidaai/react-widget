import { useNavigate } from "react-router-dom";

export const useChatNavigation = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const goToConversation = (conversationId: string) =>
    navigate(`/message/${conversationId}`);

  const goToMessages = () => navigate(`/messages`);

  return {
    goBack,
    goToConversation,
    goToMessages,
  };
};
