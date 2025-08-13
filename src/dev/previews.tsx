import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";

import ShipmentRfpWizard from "@/features/documents/wizards/ShipmentRfpWizard.tsx";
import {ReferenceDropdownBase} from "@/shared/form/reference/ReferenceDropdownBase.tsx";

import {PaletteTree} from "./palette";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ReferenceDropdownBase">
                <ReferenceDropdownBase/>
            </ComponentPreview>
            <ComponentPreview path="/ShipmentRfpWizard">
                <ShipmentRfpWizard/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;