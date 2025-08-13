import { DocumentIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'

import { FormActions } from '@/types/form.ts'

interface UseDocumentFormActionsProps {
    isEditMode: boolean
    isLoading?: boolean
    isSaving?: boolean
    isDeleting?: boolean
    canEdit: boolean
    canDelete: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    onDelete?: () => void
}

export const useDocumentFormActions = ({
                                           isEditMode,
                                           isLoading = false,
                                           isSaving = false,
                                           isDeleting = false,
                                           canEdit,
                                           canDelete = false,
                                           onEdit,
                                           onSave,
                                           onCancel,
                                           onDelete
                                       }: UseDocumentFormActionsProps): FormActions => {

    return useMemo(() => {
        const actions: FormActions = {
            cancel: {
                label: isEditMode ? 'Cancel' : 'Back',
                onClick: onCancel,
                disabled: isLoading || isSaving
            }
        }

        if (canEdit) {
            if (isEditMode) {
                actions.save = {
                    label: 'Save Changes',
                    onClick: onSave,
                    loading: isSaving,
                    disabled: isLoading,
                    icon: DocumentIcon
                }
            } else {
                actions.edit = {
                    label: 'Edit',
                    onClick: onEdit,
                    disabled: isLoading,
                    icon: PencilIcon
                }
            }
        }

        if (canDelete && onDelete && !isEditMode) {
            actions.delete = {
                label: 'Delete',
                onClick: onDelete,
                loading: isDeleting,
                disabled: isLoading || isSaving,
                icon: TrashIcon
            }
        }

        return actions
    }, [
        isEditMode,
        isLoading,
        isSaving,
        isDeleting,
        canEdit,
        canDelete,
        onEdit,
        onSave,
        onCancel,
        onDelete
    ])
}