import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";

import {PaletteTree} from "./palette";
import {ReferenceDropdownBase} from "@/components/form/reference/ReferenceDropdownBase.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ReferenceDropdownBase">
                <ReferenceDropdownBase/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;