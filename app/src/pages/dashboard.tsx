"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { getBooks } from "../services/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Loader2, Plus, Search, BookOpen } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { MainNav } from "../components/main-nav"
import { useQuery } from "@tanstack/react-query"

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { token } = useAuth()
  const navigate = useNavigate()

  const {
    data: books = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () => getBooks(token!, searchQuery || undefined),
    enabled: !!token,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="relative flex min-h-svh flex-col">
      <MainNav />
      <div className="container-wrapper">
        <main className="flex-1 container py-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Library Books</h1>
              <Button onClick={() => navigate("/books/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </div>

            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search by title or author...</span>
              </Button>
            </form>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No books found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery ? "Try a different search term" : "Add some books to get started"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <Link key={book.id} to={`/books/${book.id}`}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Author: </span>
                            {book.author}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">ISBN: </span>
                            {book.isbn}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Published: </span>
                            {new Date(book.published_date).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Badge variant={book.available ? "default" : "destructive"}>
                          {book.available ? "Available" : "Borrowed"}
                        </Badge>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

