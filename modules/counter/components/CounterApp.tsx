import * as React from "react";
import { bindActionCreators } from "redux";
import { connect, Provider } from "react-redux";

import { RootState } from "../models";
import { counterActions } from "../actions/counterActions";
import { configStore } from "../stores/RootStore";

const store = configStore();

export class CounterAppContainer extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <CounterApp></CounterApp>
            </Provider>
        );
    }
}

export interface RootProps extends RootState {
    actions?: typeof counterActions;
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(counterActions, dispatch)
});

@connect(state => state, mapDispatchToProps)

class CounterApp extends React.Component<RootProps, void> {
    render() {
        const { actions, counter } = this.props;

        return (
            <div>
                <button onClick={actions.dec}>-</button>
                <span onDoubleClick={actions.reset}>{counter}</span>
                <button onClick={actions.inc}>+</button>
            </div>
        );
    }
}
