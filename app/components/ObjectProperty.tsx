import * as React from "react";
import * as classnames from "classnames";
import { RootState, isStaticPoint, isDynamicPoint, isLine, isPath } from "../models";
import { interactActions } from "../actions/interactActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getPointPosition, resolvePathString } from "../helpers";

interface ObjectPropertyProps extends RootState {
    interactActions?: typeof interactActions
}

const keys = {
    "38": 'up',
    "40": 'down'
};

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
export class ObjectProperty extends React.Component<Partial<ObjectPropertyProps>, any> {
    render() {
        const { selectedDrawingId, drawingList, tween } = this.props;
        const drawing = selectedDrawingId ? drawingList.find(x => x.id == selectedDrawingId) : null;
        return (
            <div className="object-property">
                { !drawing &&
                    <div>点击对象选中，右键拖动画布</div>
                }
                { isStaticPoint(drawing) &&
                    <div>静态点 <strong>{drawing.id}</strong>，位置 ({drawing.x}, {drawing.y})</div>
                }
                { isDynamicPoint(drawing) &&
                    <div>轨迹点 <strong>{drawing.id}</strong>，从 {drawing.from} 到 {drawing.to}，当前位置 ({getPointPosition(drawing.id, drawingList, tween).join(', ')})</div>
                }
                { isPath(drawing) &&
                    <div className="path-wrapper">
                        <div>路径 <strong>{drawing.id}</strong>，d = "{resolvePathString(drawing, drawingList, tween, true)}"</div>
                        <textarea 
                            className={classnames({ 
                                error: !resolvePathString(drawing, drawingList, tween)
                            })} 
                            value={drawing.data} 
                            onChange={e => {
                                drawing.data = e.target.value;
                                this.props.interactActions.updateDrawing(drawing);
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
                                this.props.interactActions.updateDrawing(drawing);
                                end = start + number.length
                                setImmediate(() => {
                                    textArea.setSelectionRange(start, end);
                                });
                            }
                        }></textarea>
                    </div>
                }
            </div>
        );
    }
}