import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
    duration?: number
}

export function useToast() {
    const toast = (options: ToastOptions) => {
        const { title, description, variant, duration } = options

        if (variant === 'destructive') {
            sonnerToast.error(title, {
                description,
                duration: duration || 5000,
            })
        } else {
            sonnerToast.success(title, {
                description,
                duration: duration || 3000,
            })
        }
    }

    return { toast }
}

// Also export direct functions for convenience
export { sonnerToast as toast }
