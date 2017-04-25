///<reference types="webpack-env" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./app";

const reactRoot = document.getElementById('container');

ReactDOM.render(
    <AppContainer errorReporter={ErrorReporter}>
        <App />
    </AppContainer>, 
    reactRoot
);

function ErrorReporter({ error }) {
    console.log(error);
    return (
        <div>
            <h1>{error.message}</h1>
            <pre>{error.stack}</pre>
        </div>
    )
}

if (module.hot) {
    module.hot.accept("./app", () => {
        const NextApp = require<any>('./app').App;
        ReactDOM.render(
            <AppContainer>
                <App />
            </AppContainer>,
            reactRoot
        );
    });
}