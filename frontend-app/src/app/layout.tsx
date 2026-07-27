import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { ProtectedRoutes } from "@/components/ProtectedRoutes";
import { ToastProvider } from "@/components/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <ToastProvider>
          <AuthProvider>
            <Header />
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
