import { useMemo } from 'react'
import { authService } from '@/services/authService'
import type { ShipmentRfp, User } from '@/types'

export const useShipmentRfpPermissions = (rfp: ShipmentRfp | null, user: User | null, isCreating: boolean) => {
    const canEdit = useMemo(() => {
        if (!rfp || !user) return isCreating
        if (authService.isDemoSuperuser(user)) return true

        switch (rfp.status) {
            case 'DRAFT':
                return rfp.createdBy === user.id
            case 'ASSIGNED':
                return authService.hasRole(user, 'LOGIST') ||
                    (authService.hasRole(user, 'CARRIER') && rfp?.data?._carrier?.id === user?.organization?.id)
            default:
                return false
        }
    }, [rfp, user, isCreating])

    const canPublish = useMemo(() => {
        return rfp?.status === 'DRAFT' && authService.hasRole(user, 'LOGIST')
    }, [rfp, user])

    const canCancel = useMemo(() => {
        return ['NEW', 'ASSIGNED'].includes(rfp?.status) && authService.hasRole(user, 'LOGIST')
    }, [rfp, user])

    return { canEdit, canPublish, canCancel }
}