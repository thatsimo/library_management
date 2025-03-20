"use client"

import { CardContent } from "./ui/card"
import { Book } from "@/services/api"

interface CardBookDetailContentProps {
    book: Book
}

export function CardBookDetailContent({
    book
}: CardBookDetailContentProps) {

    return (
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
                <div className="text-sm">
                    <span className="text-muted-foreground">Type: </span>
                    {book.book_type}
                </div>
                {book.duration && (
                    <div className="text-sm">
                        <span className="text-muted-foreground">Duration: </span>
                        {book.duration}
                    </div>
                )}
                {book.file_format && (
                    <div className="text-sm">
                        <span className="text-muted-foreground">File format: </span>
                        {book.file_format}
                    </div>
                )}
                {book.pages && (
                    <div className="text-sm">
                        <span className="text-muted-foreground">Pages: </span>
                        {book.pages}
                    </div>
                )}
            </div>
        </CardContent>
    )
}
