import * as React from "react";
import * as classnames from "classnames";
import { Drawing } from "../models";
import { RootState, UIState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getPointPosition, resolvePathString } from "../helpers";

interface ObjectPropertyProps {
    drawings: Drawing[];
    selected: string;
    ui: UIState;
    actions: typeof actions.ui;
}

const keys = {
    "38": 'up',
    "40": 'down'
};

@connect(
    function mapStateToProps(state: RootState) {
        return {
            drawings: state.docs[state.activeDocId].drawingList,
            selected: state.ui.selectedDrawingId,
            ui: state.ui
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions.ui, dispatch)
        };
    }
)
export class ObjectProperty extends React.Component<Partial<ObjectPropertyProps>, any> {
    render() {
        const { selected, drawings, ui: { tween } } = this.props;
        const drawing = selected ? drawings.find(x => x.id == selected) : null;
        return (
            <div className="object-property">
                <h2>属性</h2>
                <div className="panel">
                { !drawing &&
                    <div>点击对象选中，右键拖动画布</div>
                }
                { drawing && drawing.type == 'p' &&
                    <div>静态点 <strong>{drawing.id}</strong>，位置 ({drawing.x}, {drawing.y})</div>
                }
                { drawing && drawing.type == 'd' &&
                    <div>轨迹点 <strong>{drawing.id}</strong>，从 {drawing.from} 到 {drawing.to}，当前位置 ({getPointPosition(drawing.id, drawings, tween).join(', ')})</div>
                }
                { drawing && drawing.type == 'v' &&
                    <div className="path-wrapper">
                        <div>路径 <strong>{drawing.id}</strong>，d = "{resolvePathString(drawing, drawings, tween, true)}"</div>
                        <textarea 
                            className={classnames({ 
                                error: !resolvePathString(drawing, drawings, tween)
                            })} 
                            value={drawing.data} 
                            onChange={e => {
                                drawing.data = e.target.value;
                                this.props.actions.updateDrawing(drawing);
                            }}
                            onKeyDown={e => {
                                if (!keys[e.keyCode]) return;
                                e.preventDefault();
                                const textArea = e.currentTarget;
                                let start = textArea.selectionStart,
                                    end = textArea.selectionEnd,
                                    length = Math.max(end - start, 1);

                                const content = textArea.value;
                                const parts = [];

                                parts.push(content.substr(0, start));
                                parts.push(content.substr(start, length));
                                parts.push(content.substr(start + length));

                                let number: number | string = parseInt(parts[1]);

                                if (isNaN(number)) return;

                                switch (keys[e.keyCode]) {
                                    case 'up': number++; break;
                                    case 'down': number--; break;
                                }
                                number = number.toString();

                                parts[1] = number;

                                drawing.data = parts.join('');
                                this.props.actions.updateDrawing(drawing);
                                end = start + number.length
                                setImmediate(() => {
                                    textArea.setSelectionRange(start, end);
                                });
                            }
                        }></textarea>
                    </div>
                }
                </div>
            </div>
        );
    }
}