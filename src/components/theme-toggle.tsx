'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
            if (savedTheme) return savedTheme
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        }
        return 'light'
    })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        // Use a small timeout to avoid the "setState in effect" warning if it's strictly enforced,
        // though for 'mounted' state it's a common pattern.
        const timer = setTimeout(() => {
            setMounted(true)
        }, 0)
        return () => clearTimeout(timer)
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <span className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 hover:bg-accent"
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform duration-200" />
            ) : (
                <Moon className="h-4 w-4 transition-transform duration-200" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
