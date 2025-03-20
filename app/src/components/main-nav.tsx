"use client"

import { useAuth } from "../contexts/auth-context"
import { Button } from "./ui/button"
import { BookOpen, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { ModeToggle } from "./mode-toggle"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function MainNav() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container-wrapper">
        <div className="container flex h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">Library Management</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Books
            </Link>
            <Link
              to="/my-books"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/my-books" ? "text-primary" : "text-muted-foreground",
              )}
            >
              My Books
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 ml-4">
              <div className="flex items-center gap-2">

                <Avatar >
                  <AvatarFallback>
                    {user?.username ? user.username[0].toUpperCase() : null}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username}</span>

              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
              <ModeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

