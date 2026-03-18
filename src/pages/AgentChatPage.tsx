import { AgentChat, Alert, Badge, PageLayout, PageHeader } from '@portfolio-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAgentEntitlement } from '@/hooks/useAgentEntitlement';
import { useTrustState } from '@/hooks/useTrustState';
import { TrustNotice } from '@/components/TrustStatus';

export function AgentChatPage(): JSX.Element {
  const { publicKey } = useWallet();
  const { user, loading: authLoading } = useAuthContext();
  const walletAddress = publicKey?.toBase58() ?? null;
  const subjectId = user?.wallet_address ?? walletAddress;
  const trust = useTrustState(walletAddress);
  const entitlement = useAgentEntitlement(subjectId, walletAddress);
  const showAgent = Boolean(subjectId) && entitlement.agent_access;

  return (
    <PageLayout>
      <PageHeader
        title="Buyer Agent Assistant"
        subtitle="Chat with the AI agent to search products, compare options, and get personalized recommendations."
      />
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone={entitlement.agent_access ? 'success' : 'warning'}>
            Plan {entitlement.plan_tier || 'free'}
          </Badge>
          <Badge tone={trust.state === 'verified' ? 'success' : 'warning'}>
            {trust.state === 'verified' ? 'High-trust write access enabled' : 'Read-only agent mode'}
          </Badge>
          <Badge tone="info">
            Usage {entitlement.usage.requests_used}/{entitlement.usage.requests_limit}
          </Badge>
        </div>

        {!subjectId && !authLoading ? (
          <Alert
            tone="warning"
            title="Authentication required"
            description="Sign in to AadhaarChain or connect a wallet-backed identity before starting a buyer agent session."
          />
        ) : null}

        {subjectId && !entitlement.agent_access ? (
          <Alert
            tone="warning"
            title="Subscription required"
            description={entitlement.blocked_reason ?? 'Active subscription required before starting the buyer agent.'}
          />
        ) : null}

        {subjectId && entitlement.agent_access && trust.state !== 'verified' ? (
          <TrustNotice
            state={trust.state}
            loading={trust.loading}
            error={trust.error}
            reason={entitlement.blocked_reason ?? trust.reason}
            actionLabel="Verify in AadhaarChain"
          />
        ) : null}

        {showAgent ? (
          <AgentChat
            endpoint="/api/agent/buyer"
            title="Buyer Agent"
            placeholder="e.g., Find organic mangoes under ₹500"
            requestHeaders={() =>
              subjectId
                ? {
                    'X-User-Id': subjectId,
                    ...(walletAddress ? { 'X-Wallet-Address': walletAddress } : {}),
                  }
                : {}
            }
          />
        ) : null}
      </div>
    </PageLayout>
  );
}
