import * as ActionTypes from "../ActionTypes";
import { UIMode } from "../RootState";
import { Drawing, DrawingAttribute } from "../../models";

export default {
    start(type: UIMode) {
        return {
            type: ActionTypes.INTERACT_START,
            payload: type
        };
    },

    next(...params) {
        return {
            type: ActionTypes.INTERACT_NEXT,
            payload: params
        };
    },

    selectDrawing(drawingId: string) {
        return {
            type: ActionTypes.SELECT_DRAWING,
            payload: drawingId
        };
    },

    updateDrawing(drawing: Drawing) {
        return {
            type: ActionTypes.UPDATE_DRAWING,
            payload: drawing
        };
    },

    updateAttribute(drawingId: string, attribute: Partial<DrawingAttribute>) {
        return {
            type: ActionTypes.UPDATE_ATTRIBUTE,
            payload: {
                drawingId,
                attribute
            }
        };
    },

    deleteDrawing(drawingId: string, recursive: boolean) {
        return {
            type: ActionTypes.DELETE_DRAWING,
            payload: { drawingId, recursive }
        };
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
