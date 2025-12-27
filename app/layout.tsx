import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'ScholarPath - Scholarship Discovery Platform',
    description: 'Discover and apply to academic programs with scholarships and financial aid tailored to your profile.',
    keywords: ['scholarships', 'financial aid', 'academic programs', 'study abroad', 'grants', 'fellowships'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
