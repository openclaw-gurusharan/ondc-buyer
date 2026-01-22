# React Types Versioning Rules

## Problem

In pnpm workspaces, React types can leak from workspace root causing TypeScript errors.

## Symptoms

```
error TS2786: 'Link' cannot be used as a JSX component.
Type 'ForwardRefExoticComponent...' is not a valid JSX element type.
```

## Root Cause

- Workspace root installs React 19 types
- Project specifies React 18 in package.json
- TypeScript resolves wrong types version

## Solution

### 1. Pin exact @types/react versions

```json
{
  "devDependencies": {
    "@types/react": "18.3.17",
    "@types/react-dom": "18.3.5"
  }
}
```

Use exact versions, not caret ranges (`^`).

### 2. Ensure tsconfig.json has skipLibCheck

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### 3. Verify with pnpm list

```bash
pnpm list @types/react @types/react-dom
```

Should show pinned versions, not workspace root versions.

## Validation

Before committing, run:

```bash
# Type check must pass
npm run typecheck

# Build must pass
npm run build
```
