import "./App.less";

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect, Provider } from "react-redux";

import { RootState } from "../models";
import { configStore } from "../stores/RootStore";

import { Toolbar } from "./Toolbar";
import { ObjectBrowser } from "./ObjectBrowser";
import { Stage } from "./Stage";

const store = configStore();

export class App extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <div className="svg-board-app">
                    <Toolbar />
                    <ObjectBrowser />
                    <Stage />
                </div>
            </Provider>
        );
    }
}
