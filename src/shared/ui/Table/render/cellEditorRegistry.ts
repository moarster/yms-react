import React from 'react';

import { BooleanEditor, DateEditor, NumberEditor, TextEditor } from './cellEditors';

export const cellEditors = {
  boolean: BooleanEditor,
  date: DateEditor,
  number: NumberEditor,
  text: React.memo(TextEditor),
  /* select: (props: RenderEditCellProps<any>, options: any[]) => (
        <SelectEditor {...props} options={options} />
)*/
};
