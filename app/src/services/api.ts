// API utility functions for books

export type Book = {
  id: number
  title: string
  author: string
  isbn: string
  book_type: string,
  file_format?: string,
  duration?: string,
  pages?: number,
  published_date: string
  available: boolean
  borrowed_by?: number
}

export type BookFormData = Omit<Book, "id" | "borrowed_by">

export const API_URL = `${import.meta.env.VITE_API_URL}/api`

export async function getBooks(token: string, search?: string): Promise<Book[]> {
  const url = search ? `${API_URL}/books/?search=${encodeURIComponent(search)}` : `${API_URL}/books/`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to fetch books")
  }

  return response.json()
}

export async function getBook(token: string, id: number): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to fetch book")
  }

  return response.json()
}

export async function createBook(token: string, bookData: BookFormData): Promise<Book> {
  const response = await fetch(`${API_URL}/books/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to create book")
  }

  return response.json()
}

export async function updateBook(token: string, id: number, bookData: BookFormData): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update book")
  }

  return response.json()
}

export async function partialUpdateBook(token: string, id: number, bookData: Partial<BookFormData>): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update book")
  }

  return response.json()
}

export async function deleteBook(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/books/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to delete book")
  }
}

export async function borrowBook(token: string, id: number): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}/borrow/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to borrow book")
  }

  return response.json()
}

export async function returnBook(token: string, id: number): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}/return_book/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to return book")
  }

  return response.json()
}

