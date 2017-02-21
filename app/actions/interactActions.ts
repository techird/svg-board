import { Dispatch, Action } from "redux";
import * as ActionTypes from "../constants/ActionTypes";
import { 
    Drawing, 
    StaticPoint, 
    DynamicPoint, 
    Line, 
    Path, 
    InteractiveMode,
    createStaticPoint,
    RootState 
} from "../models";

export const interactActions = {
    start(mode: InteractiveMode) {
        return {
            type: ActionTypes.INTERACT_START,
            payload: mode
        }
    },

    next(...params) {
        return {
            type: ActionTypes.INTERACT_NEXT,
            payload: params
        }
    },

    activeDrawing(drawingId: string) {
        return {
            type: ActionTypes.ACTIVE_DRAWING,
            payload: drawingId
        }
    },

    updateDrawing(update) {
        return {
            type: ActionTypes.UPDATE_DRAWING,
            payload: update
        }
    },

    updateTween(tween: number) {
        return {
            type: ActionTypes.UPDATE_TWEEN,
            payload: tween
        };
    }
};
