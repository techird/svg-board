import docActions from "./actions/docActions";
import uiActions from "./actions/uiActions";

export { configStore } from "./RootStore";
export { RootState, UIState, UIMode } from "./RootState";
export const actions ={
    doc: docActions,
    ui: uiActions,
};

