import { TrashIcon, PencilIcon, FloppyDiskBackIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { FormActions } from '@/types/form.ts';

interface UseDocumentFormActionsProps {
  canDelete: boolean;
  canEdit: boolean;
  isDeleting?: boolean;
  isEditMode: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onCancel: () => void;
  onDelete?: () => void;
  onEdit: () => void;
  onSave: () => void;
}

export const useDocumentFormActions = ({
  canDelete = false,
  canEdit,
  isDeleting = false,
  isEditMode,
  isLoading = false,
  isSaving = false,
  onCancel,
  onDelete,
  onEdit,
  onSave,
}: UseDocumentFormActionsProps): FormActions => {
  return useMemo(() => {
    const actions: FormActions = {
      cancel: {
        disabled: isLoading || isSaving,
        label: isEditMode ? 'Cancel' : 'Back',
        onClick: onCancel,
      },
    };

    if (canEdit) {
      if (isEditMode) {
        actions.save = {
          disabled: isLoading,
          icon: FloppyDiskBackIcon,
          label: 'Save Changes',
          loading: isSaving,
          onClick: onSave,
        };
      } else {
        actions.edit = {
          disabled: isLoading,
          icon: PencilIcon,
          label: 'Edit',
          onClick: onEdit,
        };
      }
    }

    if (canDelete && onDelete && !isEditMode) {
      actions.delete = {
        disabled: isLoading || isSaving,
        icon: TrashIcon,
        label: 'Delete',
        loading: isDeleting,
        onClick: onDelete,
      };
    }

    return actions;
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
    onDelete,
  ]);
};
