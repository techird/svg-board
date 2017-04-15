import { createStore as createReduxStore, applyMiddleware, MiddlewareAPI } from "redux";
import thunk from "redux-thunk";
import * as createLogger from "redux-logger";
import { UPDATE_DRAWING, UPDATE_TWEEN, ADD_DRAWING } from "./ActionTypes";

const middlewares: any[] = [thunk];

if (process.env.NODE_ENV == "development") {
    middlewares.push(createLogger({ 
        collapsed: true,
        predicate: (getState, action) => {
            if (action.type == UPDATE_DRAWING || action.type == UPDATE_TWEEN) return false;
            return true;
        }
    }));
}

export const createStore = applyMiddleware(...middlewares)(createReduxStore);
