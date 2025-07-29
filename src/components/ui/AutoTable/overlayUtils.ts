import { EmptyOverlay,LoadingOverlay } from './overlays'

export const createOverlaySlots = () => ({
    loadingOverlay: LoadingOverlay,
    noRowsOverlay: EmptyOverlay,
})
