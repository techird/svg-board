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

    selectDrawing(drawingId: string) {
        return {
            type: ActionTypes.SELECT_DRAWING,
            payload: drawingId
        }
    },

    updateDrawing(drawing: Drawing) {
        return {
            type: ActionTypes.UPDATE_DRAWING,
            payload: drawing
        }
    },

    updateTween(tween: number) {
        return {
            type: ActionTypes.UPDATE_TWEEN,
            payload: tween
        };
    },

    showAllTrack(yes: boolean) {
        return {
            type: ActionTypes.SHOW_ALL_TRACK,
            payload: yes
        };
    },

    clear() {
        return { type: ActionTypes.CLEAR_ALL };
    }
};
