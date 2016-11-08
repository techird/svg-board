import * as React from "react";

export class Toolbar extends React.Component<any, any> {
    render() {
        return (
            <div className="toolbar">
                <button>点</button>
                <button>路径</button>
            </div>
        );
    }
}