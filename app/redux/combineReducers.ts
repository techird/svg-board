import { Action, Reducer } from "redux-actions";

export type CombineMap<TRootState> = Partial<{
    [F in keyof TRootState]: (state: TRootState[F], action: Action<any>, rootState: TRootState) => TRootState[F];
}>
export function combineReducers<TRootState>(combineMap: CombineMap<TRootState>): Reducer<TRootState, any> {
    return (rootState: TRootState, action: Action<any>) => {
        const newState = {} as TRootState;

        for (let field of Object.keys(rootState) as Array<keyof TRootState>) {
            newState[field] = combineMap[field](newState[field], action, rootState);
        }

        return Object.assign({}, rootState, newState);
    };
    
}