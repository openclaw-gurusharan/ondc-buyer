import { ReactNode } from 'react';
import { SPACING, DRAMS } from '../styles';

export interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps): JSX.Element {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `${SPACING.xl} ${SPACING.lg}` }}>
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps): JSX.Element {
  return (
    <div style={{ marginBottom: SPACING.xl }}>
      <h1 style={{ color: DRAMS.textDark, margin: 0 }}>{title}</h1>
      {subtitle && (
        <p style={{ color: DRAMS.textLight, marginTop: SPACING.sm }}>{subtitle}</p>
      )}
    </div>
  );
}
