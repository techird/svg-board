import "./App.less";

import * as React from "react";
import { bindActionCreators } from "redux";
import { connect, Provider } from "react-redux";

import { RootState, configStore } from "./redux";
import { Logo } from "./components/Logo";
import { Tabs } from "./components/Tabs";
import { ObjectBrowser } from "./components/ObjectBrowser";
import { ObjectProperty } from "./components/ObjectProperty";
import { Stage } from "./components/Stage";
import { StatusBar } from "./components/Status";

const store = configStore();

export class App extends React.Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <div className="svg-board-app">
                    <Logo />
                    <Tabs />
                    <ObjectBrowser />
                    <Stage />
                    <ObjectProperty />
                    <StatusBar />
                </div>
            </Provider>
        );
    }
}