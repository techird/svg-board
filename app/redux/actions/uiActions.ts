import * as ActionTypes from "../ActionTypes";
import { UIMode } from "../RootState";
import { Drawing } from "../../models";

export default {
    start(type: UIMode) {
        return {
            type: ActionTypes.INTERACT_START,
            payload: type
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
        return { type: ActionTypes.CLEAR_CANVAS };
    }
};
