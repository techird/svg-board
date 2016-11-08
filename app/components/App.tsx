import "./App.less";

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect, Provider } from "react-redux";

import { RootState } from "../models";
import { counterActions } from "../actions/counterActions";
import { configStore } from "../stores/RootStore";

import { Toolbar } from "./Toolbar";
import { ObjectBrowser } from "./ObjectBrowser";
import { Stage } from "./Stage";

const store = configStore();

export class AppContainer extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <App></App>
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
class App extends React.Component<RootProps, void> {
    render() {
        const { actions, counter } = this.props;

        return (
            <div className="svg-board-app">
                <Toolbar />
                <ObjectBrowser />
                <Stage />
            </div>
        );
    }
}
