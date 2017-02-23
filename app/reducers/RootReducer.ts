import { combineReducers } from "redux";
import { Action } from "redux-actions";
import { RootState, InteractiveMode, Drawing, createStaticPoint, createDynamicPoint, createLine, createPath } from "../models";
import * as ActionType from "../constants/ActionTypes";

function getInteractDrawing(mode: InteractiveMode, params: any[]): Drawing {
    const creationMap = {
        'static-point': createStaticPoint,
        'dynamic-point': createDynamicPoint,
        'line': createLine,
        'path': createPath
    };

    if (creationMap[mode] && params.length >= creationMap[mode].length) {
        return creationMap[mode](...params);
    }
    return null;
}

const STORAGE_KEY = 'lastDrawingState';

const getInitialState = () => ({
    idMap: {
        p: 0,
        d: 0,
        l: 0,
        v: 0
    },
    interactiveMode: 'none',
    interactiveParams: [],
    tween: 0.5,
    selectedDrawingId: null,
    drawingList: [],
    showAllTrack: false
} as RootState);

export function RootReducer(rootState: RootState, action: Action<any>) {
    if (!rootState) {
        try {
            rootState = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            rootState = null;
        }
    }
    rootState = rootState || getInitialState();

    let { interactiveMode, interactiveParams, tween, selectedDrawingId, drawingList, idMap, showAllTrack } = rootState;

    switch (action.type) {

        case ActionType.CLEAR_ALL:
            return getInitialState();

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
                selectedDrawingId = drawing.id;
            }
            break;

        case ActionType.SELECT_DRAWING:
            selectedDrawingId = action.payload;
            break;

        case ActionType.UPDATE_DRAWING:
            const updateDrawing = action.payload as Drawing;
            const updateDrawingIndex = drawingList.findIndex(x => x.id == updateDrawing.id);
            if (updateDrawingIndex > -1) {
                let targetDrawing = drawingList[updateDrawingIndex];
                targetDrawing = Object.assign({}, targetDrawing, updateDrawing);
                drawingList.splice(updateDrawingIndex, 1, targetDrawing);
                drawingList = drawingList.slice();
            }
            break;
        
        case ActionType.UPDATE_TWEEN:
            tween = action.payload;
            break;

        case ActionType.SHOW_ALL_TRACK:
            showAllTrack = action.payload;
            break;
    }

    const nextState = { interactiveMode, interactiveParams, tween, selectedDrawingId, drawingList, idMap, showAllTrack };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
};
