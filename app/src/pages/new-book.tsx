import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CardBookFormContent } from "@/components/card-book-form-content"
import { BookFormData, createBook } from "../services/api"
import { MainNav } from "../components/main-nav"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function NewBookPage() {
  const { token } = useAuth()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
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

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container-wrapper">
        <main className="flex-1 container py-6">
          <div className="space-y-6"><Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
            <Card>
              <CardHeader>
                <CardTitle>Add Book</CardTitle>
              </CardHeader>
              <CardBookFormContent
                mutate={mutate}
                isLoading={isPending}
              />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
