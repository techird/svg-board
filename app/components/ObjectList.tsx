import * as React from "react";
import * as classnames from "classnames";
import { Drawing } from "../models";
import { RootState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ObjectListProps {
    drawings: Drawing[];
    selected: string;
    actions?: typeof actions.ui
}

@connect(
    function mapStateToProps(state: RootState) {
        return {
            drawings: state.docs[state.activeDocId].drawingList,
            selected: state.ui.selectedDrawingId
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions.ui, dispatch)
        };
    }
)
export class ObjectList extends React.Component<Partial<ObjectListProps>, any> {
    render() {
        const { drawings, selected, actions: { selectDrawing } } = this.props;
        return (
            <div className="object-list">
                <h2>对象列表</h2>
                <div className="panel">
                    <ul>
                    { drawings.map(drawing => (
                        <li key={drawing.id} className={classnames(drawing.type, { selected: drawing.id === selected })}
                            onClick={() => selectDrawing(drawing.id)}>
                            <i className="icon"></i>
                            <span className="id">{drawing.id}</span>
                            { drawing.type == 'p' &&
                                <span className="note">({drawing.x.toFixed(0)}, {drawing.y.toFixed(0)})</span>
                            }
                            { drawing.type == 'l' || drawing.type == 'd' &&
                                <span className="note">({drawing.from}, {drawing.to})</span>
                            }
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        );
    }
}