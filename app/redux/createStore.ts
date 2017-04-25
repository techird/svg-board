import { createStore as createReduxStore, applyMiddleware, MiddlewareAPI } from "redux";
import { UPDATE_DRAWING, UPDATE_TWEEN, ADD_DRAWING } from "./ActionTypes";

const middlewares: any[] = [];

export const createStore = applyMiddleware(...middlewares)(createReduxStore);
