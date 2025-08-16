import {  BooleanEditor, DateEditor,NumberEditor, TextEditor } from './cellEditors'

export const cellEditors = {
    text: TextEditor,
    number: NumberEditor,
    boolean: BooleanEditor,
    date: DateEditor,
   /* select: (props: RenderEditCellProps<any>, options: any[]) => (
        <SelectEditor {...props} options={options} />
)*/
}