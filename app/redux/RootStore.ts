///<reference types="webpack-env" />

import { rootReducer } from "./rootReducer";
import { createStore } from "./createStore";

export function configStore() {

    const store = createStore(rootReducer);

    // hot reloading
    if (module.hot) {
        module.hot.accept("./rootReducer", () => store.replaceReducer(rootReducer));
    }

    return store;
}
