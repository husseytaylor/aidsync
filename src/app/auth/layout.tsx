
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // This layout prevents the main header, footer, and chat widget from rendering on auth routes.
  // The individual auth pages provide their own backgrounds and container styling.
  return <>{children}</>;
}
