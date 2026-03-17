import { AgentChat } from '@portfolio-ui';
import { PageLayout, PageHeader } from '@portfolio-ui';

export function AgentChatPage(): JSX.Element {
  return (
    <PageLayout>
      <PageHeader
        title="Buyer Agent Assistant"
        subtitle="Chat with the AI agent to search products, compare options, and get personalized recommendations."
      />
      <AgentChat
        endpoint="/api/agent/buyer"
        title="Buyer Agent"
        placeholder="e.g., Find organic mangoes under ₹500"
      />
    </PageLayout>
  );
}
