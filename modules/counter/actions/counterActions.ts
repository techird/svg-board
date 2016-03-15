import * as ActionTypes from "../constants/ActionTypes";

export const counterActions = {
    inc() {
        return {
            type: ActionTypes.IncCounter
        }
    },
    dec() {
        return {
            type: ActionTypes.DesCounter
        }
    },
    reset() {
        return {
            type: ActionTypes.RstCounter
        }
    }
};
