import { combineReducers } from "redux";
import { Action } from "redux-actions";
import { RootState, InteractiveMode, Drawing, createStaticPoint, createDynamicPoint, createLine } from "../models";
import * as ActionType from "../constants/ActionTypes";

function getInteractDrawing(mode: InteractiveMode, params: any[]): Drawing {
    const creationMap = {
        'static-point': createStaticPoint,
        'dynamic-point': createDynamicPoint,
        'line': createLine
    };

    if (creationMap[mode] && params.length >= creationMap[mode].length) {
        return creationMap[mode](...params);
    }
    return null;
}

const STORAGE_KEY = 'lastDrawingState';

export function RootReducer(rootState: RootState, action: Action<any>) {
    if (!rootState) {
        try {
            rootState = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            rootState = null;
        }
    }
    rootState = rootState || {
        idMap: {
            p: 0,
            d: 0,
            l: 0
        },
        interactiveMode: 'none',
        interactiveParams: [],
        tween: 0.5,
        activeDrawingId: null,
        drawingList: []
    };

    let { interactiveMode, interactiveParams, tween, activeDrawingId, drawingList, idMap } = rootState;

    switch (action.type) {

        case ActionType.INTERACT_START:
            interactiveMode = action.payload;
            interactiveParams = [];
            break;

        case ActionType.INTERACT_NEXT:
            interactiveParams = [...interactiveParams, ...action.payload];
            const drawing = getInteractDrawing(interactiveMode, interactiveParams);
            if (drawing) {
                drawing.id += ++idMap[drawing.id];
                drawingList = [...drawingList, drawing];
                interactiveParams = [];
                interactiveMode = "none";
                activeDrawingId = drawing.id;
            }
            break;

        case ActionType.ACTIVE_DRAWING:
            activeDrawingId = action.payload;
            break;

        case ActionType.UPDATE_DRAWING:
            if (activeDrawingId) {
                const activeDrawingIndex = drawingList.findIndex(x => x.id == activeDrawingId);
                if (activeDrawingIndex > -1) {
                    let activeDrawing = drawingList[activeDrawingIndex];
                    activeDrawing = Object.assign({}, activeDrawing, action.payload);
                    drawingList.splice(activeDrawingIndex, 1, activeDrawing);
                    drawingList = drawingList.slice();
                }
            }
            break;
        
        case ActionType.UPDATE_TWEEN:
            tween = action.payload;
            break;
    }

    const nextState = { interactiveMode, interactiveParams, tween, activeDrawingId, drawingList, idMap };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
};
