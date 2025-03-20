"use client"

import { useAuth } from "../contexts/auth-context"
import { getBooks, returnBook } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Loader2, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { MainNav } from "../components/main-nav"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function MyBooksPage() {
  const { token, user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch all books
  const { data: allBooks = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: () => getBooks(token!),
    enabled: !!token,
  })

  // Filter books borrowed by the current user
  const myBooks = allBooks.filter((book) => book.borrowed_by === user?.id)

  // Return book mutation
  const returnMutation = useMutation({
    mutationFn: (bookId: number) => returnBook(token!, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book returned successfully")
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to return book")
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container-wrapper">
        <main className="flex-1 container py-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Borrowed Books</h1>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : myBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No books borrowed</h3>
                <p className="text-muted-foreground mt-2">You haven't borrowed any books yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/dashboard">Browse Books</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myBooks.map((book) => (
                  <Card key={book.id} className="h-full overflow-hidden">
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
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/books/${book.id}`}>View Details</Link>
                      </Button>
                      <Button
                        onClick={() => returnMutation.mutate(book.id)}
                        disabled={returnMutation.isPending && returnMutation.variables === book.id}
                      >
                        {returnMutation.isPending && returnMutation.variables === book.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Returning...
                          </>
                        ) : (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Return
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

