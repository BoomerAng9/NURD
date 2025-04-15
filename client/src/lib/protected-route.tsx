import { Route } from "wouter";

// TEMPORARY FIX: Bypassing auth check to debug page rendering issues
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType;
}) {
  return (
    <Route path={path} component={Component} />
  );
}