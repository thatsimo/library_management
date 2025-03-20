"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { getBook, updateBook } from "../services/api"
import type { BookFormData } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle } from "../components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MainNav } from "../components/main-nav"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CardBookFormContent } from "@/components/card-book-form-content"

export function EditBookPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const bookId = Number.parseInt(id!)
  const queryClient = useQueryClient()

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook(token!, bookId),
    enabled: !!token && !!bookId,
  })

  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    published_date: book?.published_date?.split("T")[0] || new Date().toISOString().split("T")[0],
    available: book?.available ?? true,
    book_type: book?.book_type || "printed", // Default to printed
    pages: book?.pages || undefined,
    duration: book?.duration || undefined,
    file_format: book?.file_format || undefined,
  })

  useState(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        published_date: book.published_date.split("T")[0],
        available: book.available,
        book_type: book.book_type || "printed",
        pages: book.pages || undefined,
        duration: book.duration || undefined,
        file_format: book.file_format || undefined,
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: BookFormData) => updateBook(token!, bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book updated successfully")
      navigate(`/books/${bookId}`)
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to update book")
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container-wrapper">
          <MainNav />
          <main className="flex-1 container py-6">
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container-wrapper">
        <main className="flex-1 container py-6">
          <div className="space-y-6">
            <Button variant="outline" onClick={() => navigate(`/books/${bookId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book Details
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Edit Book</CardTitle>
              </CardHeader>
              <CardBookFormContent
                mutation={updateMutation}
                formData={formData}
                setFormData={setFormData}
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
