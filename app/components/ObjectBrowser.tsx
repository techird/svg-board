import * as React from "react";
import { ObjectList } from "./ObjectList";
import { ObjectProperty } from "./ObjectProperty";

export class ObjectBrowser extends React.Component<any, any> {
    render() {
        return (
            <div className="object-browser">
                <ObjectList />
            </div>
        );
    }
}