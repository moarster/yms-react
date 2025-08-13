import { EmptyOverlay,LoadingOverlay } from './overlays.tsx'

export const createOverlaySlots = () => ({
    loadingOverlay: LoadingOverlay,
    noRowsOverlay: EmptyOverlay,
})
