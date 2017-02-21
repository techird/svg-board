///<reference types="webpack-env" />

import * as RootReducerModule from "../reducers/RootReducer";
import { createStore } from "./createStore";

export function configStore() {

    const store = createStore(RootReducerModule.RootReducer);

    // hot reloading
    if (module.hot) {
        module.hot.accept("../reducers/RootReducer", () => {
            store.replaceReducer(require<typeof RootReducerModule>("../reducers/RootReducer").RootReducer);
        });
    }

    return store;
}
