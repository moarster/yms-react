import { FieldLayoutConfig } from '../types'

export const getFieldLayout = (isSidebarField: boolean): FieldLayoutConfig => {
    if (isSidebarField) {
        return {
            wrapperClass: "mb-4",
            labelClass: "block text-sm font-medium text-gray-700 mb-1"
        }
    }

    return {
        wrapperClass: "mb-6",
        labelClass: "block text-sm font-medium text-gray-900 mb-2"
    }
}