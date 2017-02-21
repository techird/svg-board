import * as React from "react";

import { RootState, isStaticPoint, isDynamicPoint, isLine } from "../models";
import { interactActions } from "../actions/interactActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ObjectListProps extends RootState {
    interactActions?: typeof interactActions
}

@connect(
    function mapStateToProps(state: RootState) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return {
            interactActions: bindActionCreators(interactActions, dispatch)
        };
    }
)
export class ObjectList extends React.Component<Partial<ObjectListProps>, any> {
    render() {
        return (
            <div className="object-list">
                <h2>对象列表</h2>
                <ul>
                    { this.props.drawingList.map(drawing => {
                        return (
                            <li key={drawing.id} className={drawing.type}>
                                <i className="icon"></i>
                                <span className="id">{drawing.id}</span>
                                { isStaticPoint(drawing) &&
                                    <span className="note">({drawing.x.toFixed(0)}, {drawing.y.toFixed(0)})</span>
                                }
                                { isLine(drawing) || isDynamicPoint(drawing) &&
                                    <span className="note">({drawing.from}, {drawing.to})</span>
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}