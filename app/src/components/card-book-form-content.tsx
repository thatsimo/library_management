"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { CardContent, CardFooter } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "./ui/select"
import { Book, BookFormData } from "@/services/api"
import { UseMutateFunction } from "@tanstack/react-query"

interface CardBookFormContentProps {
    mutate: UseMutateFunction<Book, Error, BookFormData, unknown>
    isLoading?: boolean
    book?: Book
}

export function CardBookFormContent({
    isLoading, mutate, book
}: CardBookFormContentProps) {

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            book_type: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        mutate(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                        id="isbn"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        required
                    />
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
                <div className="space-y-2">
                    <Label htmlFor="book_type">Book Type</Label>
                    <Select
                        name="book_type"
                        value={formData.book_type || "printed"}
                        onValueChange={onSelectChange}
                    >
                        <SelectTrigger>
                            <SelectValue>{formData.book_type || "printed"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="printed">Printed</SelectItem>
                            <SelectItem value="ebook">Ebook</SelectItem>
                            <SelectItem value="audiobook">Audiobook</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.book_type === "printed" && (
                    <div className="space-y-2">
                        <Label htmlFor="pages">Pages</Label>
                        <Input
                            id="pages"
                            name="pages"
                            type="number"
                            value={formData.pages || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {formData.book_type === "ebook" && (
                    <div className="space-y-2">
                        <Label htmlFor="file_format">File Format</Label>
                        <Input
                            id="file_format"
                            name="file_format"
                            value={formData.file_format || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                {formData.book_type === "audiobook" && (
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            value={formData.duration || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="available"
                        name="available"
                        checked={formData.available}
                        onCheckedChange={(checked) =>
                            // We mimic an event for handleChange for consistency
                            handleChange({
                                target: {
                                    name: "available",
                                    value: checked,
                                    type: "checkbox",
                                    checked: checked,
                                },
                            } as React.ChangeEvent<HTMLInputElement>)
                        }
                    />
                    <Label htmlFor="available">Available for borrowing</Label>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </CardFooter>
        </form>
    )
}
