import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { catalogService } from '@/services/catalogService'
import { BaseLink } from '@/types'

interface UseReferenceDropdownProps {
    catalog: string
    domain: 'lists' | 'catalogs'
    onChange: (value: BaseLink | null) => void
}

export const useReferenceDropdown = ({
                                         catalog,
                                         domain,
                                         onChange
                                     }: UseReferenceDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { data: optionsData, isLoading, refetch } = useQuery({
        queryKey: [domain, catalog, 'items', searchTerm],
        queryFn: async () => {
            if (domain === 'lists') {
                const response = await catalogService.getListItems(catalog, {
                    search: searchTerm,
                    size: 50
                })
                return response.content
            } else {
                const response = await catalogService.getCatalogItems(catalog, {
                    search: searchTerm,
                    size: 50
                })
                return response.content
            }
        },
        enabled: isOpen,
        staleTime: 5 * 60 * 1000,
    })

    const options = optionsData?.map(item => ({
        id: item.id!,
        title: item.title || item?.data?.title,
        domain,
        entity: 'item' as const,
        catalog
    })) || []

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: BaseLink) => {
        onChange(option)
        setIsOpen(false)
        setSearchTerm('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(null)
    }

    const handleToggle = () => {
        if (!isOpen) {
            refetch()
        }
        setIsOpen(!isOpen)
    }

    return {
        isOpen,
        searchTerm,
        setSearchTerm,
        options,
        isLoading,
        dropdownRef,
        handleSelect,
        handleClear,
        handleToggle
    }
}