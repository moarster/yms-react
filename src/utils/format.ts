import { format as formatDate, formatDistanceToNow, parseISO } from 'date-fns'

export const formatters = {
    // Date formatting
    date: (date: string | Date) => {
        const d = typeof date === 'string' ? parseISO(date) : date
        return formatDate(d, 'MMM dd, yyyy')
    },

    dateTime: (date: string | Date) => {
        const d = typeof date === 'string' ? parseISO(date) : date
        return formatDate(d, 'MMM dd, yyyy HH:mm')
    },

    time: (date: string | Date) => {
        const d = typeof date === 'string' ? parseISO(date) : date
        return formatDate(d, 'HH:mm')
    },

    timeAgo: (date: string | Date) => {
        const d = typeof date === 'string' ? parseISO(date) : date
        return formatDistanceToNow(d, { addSuffix: true })
    },

    // Number formatting
    currency: (amount: number, currency = 'RUB') => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency,
        }).format(amount)
    },

    number: (value: number) => {
        return new Intl.NumberFormat('ru-RU').format(value)
    },

    weight: (kg: number) => {
        if (kg >= 1000) {
            return `${(kg / 1000).toFixed(1)} t`
        }
        return `${kg} kg`
    },

    volume: (m3: number) => {
        return `${m3} m³`
    },

    fileSize: (bytes: number) => {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 B'
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    },

    // Text formatting
    truncate: (text: string, length = 50) => {
        if (text.length <= length) return text
        return text.substring(0, length).trim() + '...'
    },

    capitalize: (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    },

    pascalCase: (text: string) => {
        return text
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())
    },

    // Phone formatting
    phone: (phone: string) => {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
        }
        return phone
    },

    // Address formatting
    address: (address: string) => {
        return address.replace(/,\s*/g, ', ').trim()
    },

    // Status formatting
    status: (status: string) => {
        const statusMap: Record<string, string> = {
            DRAFT: 'Draft',
            ASSIGNED: 'Assigned',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
            PENDING: 'Pending',
            APPROVED: 'Approved',
            REJECTED: 'Rejected',
        }
        return statusMap[status] || formatters.pascalCase(status)
    },
}

// Validation helpers
export const validators = {
    email: (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    },

    phone: (phone: string) => {
        const cleaned = phone.replace(/\D/g, '')
        return cleaned.length >= 10
    },

    inn: (inn: string) => {
        const cleaned = inn.replace(/\D/g, '')
        return cleaned.length === 10 || cleaned.length === 12
    },

    ogrn: (ogrn: string) => {
        const cleaned = ogrn.replace(/\D/g, '')
        return cleaned.length === 13 || cleaned.length === 15
    },

    positiveNumber: (value: number) => {
        return value > 0
    },

    url: (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    },
}

// Color helpers
export const colors = {
    status: (status: string) => {
        const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
            ASSIGNED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
            COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
            APPROVED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
        }
        return colorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    },

    priority: (priority: 'low' | 'medium' | 'high' | 'urgent') => {
        const colorMap = {
            low: { bg: 'bg-gray-100', text: 'text-gray-800' },
            medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            high: { bg: 'bg-orange-100', text: 'text-orange-800' },
            urgent: { bg: 'bg-red-100', text: 'text-red-800' },
        }
        return colorMap[priority]
    },
}