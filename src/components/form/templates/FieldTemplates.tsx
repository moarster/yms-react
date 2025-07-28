import { FieldTemplateProps } from './types'
import { StandardFieldTemplate } from './fields/StandardFieldTemplate'
import { ReferenceFieldTemplate } from './fields/ReferenceFieldTemplate'
import { ReferenceArrayFieldTemplate } from './fields/ReferenceArrayFieldTemplate'

export const createFieldTemplate = () => (props: FieldTemplateProps) => {
    const { id, schema } = props
    const isReferenceField = id.startsWith('root__')

    // Handle reference fields with custom dropdown
    if (isReferenceField && schema.type === 'object') {
        return <ReferenceFieldTemplate {...props} />
    }

    // Handle array of reference fields (like _candidates)
    if (isReferenceField && schema.type === 'array' && schema.items?.type === 'object') {
        return <ReferenceArrayFieldTemplate {...props} />
    }

    // Standard field rendering
    return <StandardFieldTemplate {...props} />
}
