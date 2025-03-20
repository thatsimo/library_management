"use client"

import { useAuth } from "../contexts/auth-context"
import { getBook, borrowBook, returnBook, deleteBook } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Loader2, Edit, Trash2, ArrowLeft, BookMarked, BookOpen } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { MainNav } from "../components/main-nav"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function BookDetailsPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const bookId = Number.parseInt(id!)
  const queryClient = useQueryClient()

  // Fetch book details
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook(token!, bookId),
    enabled: !!token && !!bookId,
  })

  // Borrow book mutation
  const borrowMutation = useMutation({
    mutationFn: () => borrowBook(token!, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book borrowed successfully")
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to borrow book")
    },
  })

  // Return book mutation
  const returnMutation = useMutation({
    mutationFn: () => returnBook(token!, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book returned successfully")
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to return book")
    },
  })

  // Delete book mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(token!, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book deleted successfully")
      navigate("/dashboard")
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to delete book")
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container-wrapper">
          <main className="flex-1 container py-6">
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container-wrapper">
          <main className="flex-1 container py-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Book not found</h3>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Books
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const isBookBorrowedByUser = book.borrowed_by === user?.id
  const isActionLoading = borrowMutation.isPending || returnMutation.isPending || deleteMutation.isPending

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container-wrapper">
        <main className="flex-1 container py-6">
          <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>

            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{book.title}</CardTitle>
                  <Badge variant={book.available ? "default" : "destructive"}>
                    {book.available ? "Available" : "Borrowed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Author</h3>
                    <p>{book.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">ISBN</h3>
                    <p>{book.isbn}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Published Date</h3>
                    <p>{new Date(book.published_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Type</h3>
                    <p>{book.book_type}</p>
                  </div>

                  {book.duration && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">Duration</h3>
                      <p>{book.duration}</p>
                    </div>
                  )}
                  {book.file_format && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">File Format</h3>
                      <p>{book.file_format}</p>
                    </div>
                  )}
                  {book.pages && (
                    <div>
                      <h3 className="font-medium text-muted-foreground">Pages</h3>
                      <p>{book.pages}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => navigate(`/books/${book.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the book from the library.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={isActionLoading}>
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {book.available ? (
                  <Button onClick={() => borrowMutation.mutate()} disabled={isActionLoading}>
                    {borrowMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <BookMarked className="mr-2 h-4 w-4" />
                        Borrow
                      </>
                    )}
                  </Button>
                ) : isBookBorrowedByUser ? (
                  <Button onClick={() => returnMutation.mutate()} disabled={isActionLoading}>
                    {returnMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Return
                      </>
                    )}
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

