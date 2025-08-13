export const getEnvVar = (name: string, defaultValue?: string): string => {
    const value = import.meta.env[name] || defaultValue
    if (!value) {
        throw new Error(`Environment variable ${name} is required`)
    }
    return value
}