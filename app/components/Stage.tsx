import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classnames from "classnames";
import { RootState, isStaticPoint, isDynamicPoint, isLine, isPath, Drawing, StaticPoint, DynamicPoint, Line, Path } from "../models";
import { interactActions } from "../actions/interactActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getPointPosition, resolvePathString } from "../helpers";

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_RIGHT = 2;

interface StageProps extends RootState {
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
export class Stage extends React.Component<Partial<StageProps>, any> {
    containerNode: HTMLDivElement;
    svgNode: SVGSVGElement;

    state = {
        width: 100,
        height: 100,
        offsetLeft: 0,
        offsetTop: 0,
        mouseX: 0,
        mouseY: 0
    }

    render() {
        const {
            interactiveMode,
            interactiveParams,
            drawingList,
            interactActions
        } = this.props;

        return (
            <div 
                className="stage-container" 
                onMouseDown={e => this.handleMouseDown(e)} 
                onMouseMove={e => this.handleMouseMove(e)}
                onContextMenu={e => e.preventDefault()} 
                onDoubleClick={() => this.view.reset()}>
                <svg className="stage" width={this.state.width} height={this.state.height} viewBox={this.generateViewBox()}>
                    <defs>
                        <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                            <rect width="100" height="100" fill="#f0f0f0"></rect>
                            <rect width="100" height="100" x="100" y="100" fill="#f0f0f0"></rect>
                        </pattern>
                    </defs>

                    <rect x="-10000000.5" y="-10000000.5" width="20000000" height="20000000" fill="url(#grid)"></rect>

                    <path d="M -10000000 0.5 L 10000000 0.5 M 0.5 -10000000 L 0.5 10000000" fill="none" stroke="gray" />

                    {interactiveMode == "static-point" &&
                        <circle className="interactive-point" cx={this.state.mouseX} cy={this.state.mouseY} r="10" fill="orange" opacity="0.5" />
                    }
                    {drawingList.slice().reverse().map(drawing => this.renderDrawing(drawing))}
                </svg>
            </div>
        );
    }

    componentDidMount() {
        this.containerNode = ReactDOM.findDOMNode(this) as HTMLDivElement;
        this.svgNode = this.containerNode.children.item(0) as SVGSVGElement;

        const updateSize = () => {
            const { clientWidth: width, clientHeight: height } = this.containerNode;
            this.setState({ width, height });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        window.addEventListener('mouseup', () => this.handleMouseUp());
    }  

    private renderDrawing(drawing: Drawing) {
        const className = classnames(drawing.type, { 
            interactive: this.interact.isActived(drawing),
            selected: this.props.selectedDrawingId == drawing.id
        });
        return (
            <g key={drawing.id} className={className}>
            { 
                isStaticPoint(drawing) ? this.renderStaticPoint(drawing) :
                isDynamicPoint(drawing) ? this.renderDynamicPoint(drawing) :
                isLine(drawing) ? this.renderLine(drawing) :
                isPath(drawing) ? this.renderPath(drawing) : null
            }
            </g>
        );
    }

    private renderStaticPoint(drawing: StaticPoint) {
        return (
            <g transform={`translate(${drawing.x}, ${drawing.y})`}>
                <circle className="static-point" r="5" onMouseDown={e => this.handleMouseDown(e, drawing)} />
                <text textAnchor="middle" dy="-10">{`${drawing.id}(${drawing.x.toFixed(0)}, ${drawing.y.toFixed(0)})`}</text>
            </g>
        );
    }

    private renderDynamicPoint(drawing: DynamicPoint) {
        const [x, y] = this.getPointPosition(drawing.id);
        let track: number[] = [];
        for (let t = 0; t <= 100; t += 5) {
            track = [...track, ...this.getPointPosition(drawing.id, t / 100)];
        }
        return (
            <g className={classnames({ 'show-track': this.props.showAllTrack })}>
                <path d={`M${track.shift()} ${track.shift()} L ${track.join(' ')}`} />
                <g transform={`translate(${x}, ${y})`}>
                    <circle className="dynamic-point" r="5" onMouseDown={e => this.handleMouseDown(e, drawing)} />
                    <text textAnchor="middle" dy="15">{`${drawing.id}(${x.toFixed(0)}, ${y.toFixed(0)})`}</text>
                </g>
            </g>
        );
    }

    private renderLine(drawing: Line) {
        const [x1, y1] = this.getPointPosition(drawing.from);
        const [x2, y2] = this.getPointPosition(drawing.to);
        return (
            <g>
                <line className="line" {...{x1, y1, x2, y2}}></line>
            </g>
        );
    }

    private renderPath(drawing: Path) {
        const { drawingList, tween } = this.props;
        return (
            <g>
                <path d={resolvePathString(drawing, drawingList, tween, true) || "M 0 0"} />
            </g>
        );
    }

    private getPointPosition(id: string, t = this.props.tween) {
        return getPointPosition(id, this.props.drawingList, t);
    }

    private generateViewBox() {
        const width = this.state.width;
        const height = this.state.height;
        const left = -Math.floor(width / 2) + this.state.offsetLeft;
        const top = -Math.floor(height / 2) + this.state.offsetTop;
        return [left, top, width, height].join(' ');
    }

    /**
     *  处理视野拖放
     */
    private view = {
        dragging: false,
        dragPosition: { x: 0, y: 0 },
        dragStart: (x: number, y: number) => {
            this.view.dragging = true
            this.view.dragPosition = { x, y };
        },
        dragMove: (x: number, y: number) => {
            if (!this.view.dragging) return;
            const { x: lx, y: ly } = this.view.dragPosition;
            const dx = x - lx;
            const dy = y - ly;
            this.setState({
                offsetLeft: this.state.offsetLeft - dx,
                offsetTop: this.state.offsetTop - dy
            });
            this.view.dragPosition = { x, y };
        },
        dragEnd: () => {
            this.view.dragging = false;
        },
        reset: () => {
            this.setState({ offsetLeft: 0, offsetTop: 0 });
        }
    }

    /**
     * 交互处理
     */
    private interact = {
        isActived: (drawing: Drawing) => {
            const { interactiveParams = [] } = this.props;
            for (let param of interactiveParams) {
                if (param == drawing.id) {
                    return true;
                }
            }
            return false;
        },
        active: (drawing: Drawing) => {
            const { interactiveMode, interactiveParams, interactActions } = this.props;
            if (drawing) {
                interactActions.selectDrawing(drawing.id);
                this.interact.start(drawing);
            } else {
                interactActions.selectDrawing(null);
            }
            switch (interactiveMode) {
                case "none": break;
                case "static-point":
                    interactActions.next(this.state.mouseX, this.state.mouseY);
                    break;
                case "dynamic-point":
                case "line":
                    if (drawing && !this.interact.isActived(drawing) && (isStaticPoint(drawing) || isDynamicPoint(drawing))) {
                        interactActions.next(drawing.id);
                    }
                    break;
            }
        },
        _draggingPoint: null as StaticPoint,
        _startDrawing: null as Drawing,
        _hasMoved: false,
        _started: false,
        start: (drawing: Drawing) => {
            if (drawing) {
                if (isStaticPoint(drawing)) {
                    this.interact._draggingPoint = drawing;
                }
                this.interact._startDrawing = drawing;
            }
            this.interact._hasMoved = false;
            this.interact._started = true;
        },
        move: (x: number, y: number) => {
            const point = this.interact._draggingPoint;
            if (point) {
                point.x = x;
                point.y = y;
                this.props.interactActions.updateDrawing(point);
            }
            this.interact._hasMoved = true;
        },
        end: () => {
            if (this.interact._started && !this.interact._hasMoved) {
                this.interact.active(this.interact._startDrawing);
            }
            this.interact._started = false;
            this.interact._draggingPoint = null;
            this.interact._startDrawing = null;
        }
    }

    private handleMouseDown(e: React.MouseEvent<Element>, drawing?: Drawing) {
        // 右键启用拖动
        if (e.button == MOUSE_BUTTON_RIGHT) {
            this.view.dragStart(e.pageX, e.pageY);
        }
        if (e.button == MOUSE_BUTTON_LEFT) {
            this.interact.start(drawing);
        }
        e.stopPropagation();
    }

    private handleMouseMove(e: React.MouseEvent<Element>) {
        // 更新视野拖动
        this.view.dragMove(e.pageX, e.pageY);

        // 更新鼠标位置
        const { x, y } = this.updateMousePosition(e);

        // 更新拖动点
        this.interact.move(x, y);
    }

    private handleMouseUp() {
        // 结束视野拖动
        this.view.dragEnd();

        // 结束点拖动
        this.interact.end();
    }

    /**
     * 计算鼠标位置
     */
    private updateMousePosition(e: React.MouseEvent<Element>) {
        const clientPoint = this.svgNode.createSVGPoint();
        clientPoint.x = e.clientX;
        clientPoint.y = e.clientY;
        const svgPoint = clientPoint.matrixTransform(this.svgNode.getScreenCTM().inverse());
        this.setState({ mouseX: svgPoint.x, mouseY: svgPoint.y });
        return { x: Math.round(svgPoint.x), y: Math.round(svgPoint.y) };
    }
}