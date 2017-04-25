import * as React from "react";
import * as classnames from "classnames";
import ScrollArea from "react-scrollbar";
import { HotKeys } from "react-hotkeys";
import { Drawing, DrawingAttribute, DrawingType, getAttributeWithDefault, DrawingAttributeMap } from "../models";
import { RootState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ObjectListProps {
    drawings: Drawing[];
    attributes: DrawingAttributeMap;
    selected: string;
    actions?: typeof actions.ui
}

@connect(
    function mapStateToProps(state: RootState) {
        return {
            drawings: state.docs[state.activeDocId].drawingList,
            attributes: state.docs[state.activeDocId].attributes || {},
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
        const { drawings, selected, attributes, actions: { selectDrawing, updateAttribute } } = this.props;
        return (
            <div className="object-list">
                <h2>对象列表</h2>
                <HotKeys handlers={this.keyHandlers}>
                    <ScrollArea className="panel" speed={0.8} smoothScrolling >
                        <ul>
                        { drawings.map(drawing => 
                            <DrawingItem
                                key={drawing.id}
                                drawing={drawing}
                                attribute={getAttributeWithDefault(drawing, attributes[drawing.id])}
                                selected={selected}
                                selectDrawing={selectDrawing}
                                updateAttribute={updateAttribute}
                            /> 
                        )}
                        </ul>
                    </ScrollArea>
                </HotKeys>
            </div>
        );
    }

    get keyHandlers() {
        const { selected } = this.props;
        const { deleteDrawing } = this.props.actions;
        return {
            'del': () => selected && deleteDrawing(selected, false),
            'shift+del': () => selected && deleteDrawing(selected, true),
        }
    }
}

interface DrawingItemProps {
    drawing: Drawing,
    attribute: Partial<DrawingAttribute>,
    selected: string;
    selectDrawing: typeof actions.ui.selectDrawing,
    updateAttribute: typeof actions.ui.updateAttribute,
}
function DrawingItem({ drawing, attribute, selected, selectDrawing, updateAttribute }: DrawingItemProps) {
    return (
        <li className={classnames(drawing.type, { selected: drawing.id === selected })}
            onClick={() => selectDrawing(drawing.id)}>
            <i className="icon"></i>
            <span className="id">{drawing.id}</span>
            { drawing.type == 'p' &&
                <span className="note">({drawing.x.toFixed(0)}, {drawing.y.toFixed(0)})</span>
            }
            { drawing.type == 'l' || drawing.type == 'd' &&
                <span className="note">({drawing.from}, {drawing.to})</span>
            }
            <a
                className={classnames("visibility", { 
                    'visible': attribute.visible,
                    'track-visible': attribute.trackVisible
                })}
                onClick={e => {
                    e.stopPropagation();
                    const update = (attribute: Partial<DrawingAttribute>) => updateAttribute(drawing.id, attribute);
                    if (drawing.type == 'd') {
                        if (!attribute.visible) {
                            update({ visible: true, trackVisible: false });
                        }
                        else if (!attribute.trackVisible) {
                            update({ visible: true, trackVisible: true });
                        }
                        else {
                            update({ visible: false, trackVisible: false });
                        }
                    } else {
                        update({ visible: !attribute.visible });
                    }
                }}>
                <i className="material-icons">visibility</i>
            </a>
        </li>
    );
}