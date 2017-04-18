///<reference types="webpack-env" />

import { rootReducer } from "./rootReducer";
import { createStore } from "./createStore";

export function configStore() {

    const DEV_TOOL = '__REDUX_DEVTOOLS_EXTENSION__';
    const store = createStore(rootReducer, window[DEV_TOOL] && window[DEV_TOOL]());

    // hot reloading
    if (module.hot) {
        module.hot.accept("./rootReducer", () => store.replaceReducer(rootReducer));
    }

    return store;
}
