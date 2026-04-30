import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BarChart3, Home, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import AppFooter from "./AppFooter";
import SearchBar from "./SearchBar";

const NAV_ITEMS = [
  { path: "/", label: "Feed", icon: Home },
  { path: "/editor", label: "Write", icon: PenLine },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 gap-4">
          <Link to="/" className="flex items-center font-bold text-lg text-foreground shrink-0">
            <span className="text-primary">S</span>takify
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={cn("flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                  <Icon className="w-4 h-4" />{item.label}
                </Link>
              );
            })}
          </div>
          <div className="w-64 hidden lg:block"><SearchBar /></div>
        </div>
      </header>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={cn("flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                <Icon className="w-5 h-5" />{item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="flex-1 pb-20 md:pb-0"><Outlet /></main>
      <AppFooter />
    </div>
  );
}