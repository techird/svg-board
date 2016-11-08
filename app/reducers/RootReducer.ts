import { Action } from "redux-actions";
import { RootState } from "../models";
import * as ActionType from "../constants/ActionTypes";

export function RootReducer(state: RootState, action: Action): RootState {
    switch (action.type) {
        case ActionType.IncCounter:
            return { counter: state.counter + 1 };
        case ActionType.DesCounter:
            return { counter: state.counter - 1 };
        case ActionType.RstCounter:
            return { counter: 0 };
    }

    return state || { counter: 0 };
}
