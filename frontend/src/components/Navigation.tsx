import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Shield, RefreshCw } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdminWithTimeout } from "../hooks/useIsCallerAdminWithTimeout";
import LoginButton from "./LoginButton";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
  { to: "/", label: "Galerie" },
  { to: "/nft-galerie", label: "NFT Galerie" },
  { to: "/upload", label: "Upload" },
  { to: "/blog", label: "Blog" },
  { to: "/kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { phase, isAdmin, retry } = useIsCallerAdminWithTimeout();
  const location = useLocation();

  const showAdminLink = isAuthenticated && phase === "confirmed" && isAdmin;
  const showRetry = isAuthenticated && (phase === "timeout" || phase === "error");

  return (
    <TooltipProvider>
      <nav className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/generated/logo.dim_256x256.png"
            alt="Istvan Seidel"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif text-lg font-light tracking-wide text-foreground hidden sm:block">
            Istvan Seidel
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin link — only shown when confirmed admin */}
          {showAdminLink && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/admin"
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          {/* Retry button when admin check timed out or errored */}
          {showRetry && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={retry}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Admin-Status erneut prüfen</p>
              </TooltipContent>
            </Tooltip>
          )}

          <LoginButton />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü öffnen"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-sm px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {showAdminLink && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/admin"
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          {showRetry && (
            <button
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              onClick={() => {
                retry();
                setMobileOpen(false);
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Admin-Status prüfen
            </button>
          )}

          <LoginButton />
        </div>
      )}
    </TooltipProvider>
  );
}
