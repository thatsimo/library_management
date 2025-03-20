"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { getBook, updateBook } from "../services/api"
import type { BookFormData } from "../services/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Loader2, ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MainNav } from "../components/main-nav"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function EditBookPage() {
  const { token } = useAuth()
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

  // Initialize form data from book data
  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    published_date: book?.published_date?.split("T")[0] || new Date().toISOString().split("T")[0],
    available: book?.available ?? true,
  })

  // Update form data when book data is loaded
  useState(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        published_date: book.published_date.split("T")[0],
        available: book.available,
      })
    }
  })

  // Update book mutation
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

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
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="published_date">Published Date</Label>
                    <Input
                      id="published_date"
                      name="published_date"
                      type="date"
                      value={formData.published_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      name="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked === true }))}
                    />
                    <Label htmlFor="available">Available for borrowing</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

