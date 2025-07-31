import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";

import {PaletteTree} from "./palette";
import {ReferenceDropdownBase} from "@/components/form/reference/ReferenceDropdownBase.tsx";
import ShipmentRfpWizard from "@/components/wizards/MockWizard.tsx";

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