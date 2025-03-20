"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { createBook } from "../services/api"
import type { BookFormData } from "../services/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Loader2, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MainNav } from "../components/main-nav"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function NewBookPage() {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    published_date: new Date().toISOString().split("T")[0],
    available: true,
  })
  const { token } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: BookFormData) => createBook(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast("Book created successfully")
      navigate("/dashboard")
    },
    onError: (error: Error) => {
      toast(error.message || "Failed to create book")
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
    createMutation.mutate(formData)
  }

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

            <Card>
              <CardHeader>
                <CardTitle>Add New Book</CardTitle>
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
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Book"
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

