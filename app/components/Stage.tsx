import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classnames from "classnames";
import { HotKeys } from "react-hotkeys";
import { Drawing, StaticPoint, DynamicPoint, Line, Path, Doc, getAttributeWithDefault, DrawingAttributeMap } from "../models";
import { Toolbar } from "./Toolbar";
import { RootState, UIState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getPointPosition, resolvePathString } from "../helpers";

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_RIGHT = 2;

interface StageProps {
    drawings: Drawing[];
    selectedDrawingId: string;
    attributes: DrawingAttributeMap;
    ui: UIState;
    actions?: typeof actions.ui;
}

@connect(
    function mapStateToProps(state: RootState) {
        return {
            drawings: state.docs[state.activeDocId].drawingList,
            selectedDrawingId: state.ui.selectedDrawingId,
            attributes: state.docs[state.activeDocId].attributes || {},
            ui: state.ui,
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions.ui, dispatch)
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
        mouseY: 0,
        dragging: false,
    }

    get drawings() {
        return this.props.drawings;
    }

    get ui() {
        return this.props.ui;
    }

    get actions() {
        return this.props.actions;
    }

    render() {
        const drawings = this.drawings;
        const { mode, params } = this.ui;
        const { dragging, offsetLeft, offsetTop } = this.state;
        const keyMap = {  
            'deleteNode': ['del', 'backspace'],
        };
        return (
            <div
                ref={div => this.containerNode = div}
                className={classnames("stage-container", "mode-" + mode)}
                onMouseDown={e => this.handleMouseDown(e)} 
                onMouseMove={e => this.handleMouseMove(e)}
                onContextMenu={e => e.preventDefault()}
                onDoubleClick={() => this.view.reset()}>
                <HotKeys keyMap={keyMap} handlers={this.keyHandlers}>
                    <svg ref={svg => this.svgNode = svg as SVGSVGElement} className="stage" width={this.state.width} height={this.state.height} viewBox={this.generateViewBox()}>
                        <defs>
                            <pattern id="grid" width="200" height="200" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                <rect width="100" height="100" fill="#F6F6F6"></rect>
                                <rect width="100" height="100" x="100" y="100" fill="#F6F6F6"></rect>
                            </pattern>
                        </defs>

                        <g className={classnames("view", { dragging })} transform={`translate(${-offsetLeft}, ${-offsetTop})`}>
                            <rect className="grid" x="-10000000.5" y="-10000000.5" width="20000000" height="20000000" fill="url(#grid)"></rect>

                            <path className="axis" d="M -10000000 0.5 L 10000000 0.5 M 0.5 -10000000 L 0.5 10000000" fill="none" stroke="#999" strokeWidth="1" />

                            { mode == "p" &&
                                <circle className="interactive-point" cx={this.state.mouseX} cy={this.state.mouseY} r="10" fill="orange" opacity="0.5" />
                            }
                            { drawings.slice().reverse().map(drawing => this.renderDrawing(drawing)) }
                        </g>
                    </svg>
                    <Toolbar />
                </HotKeys>
            </div>
        );
    }

    get keyHandlers() {
        const { start, clear, deleteDrawing, offset } = this.actions;
        const { selectedDrawingId } = this.props;

        return {
            'esc': () => start('idle'),
            'p': () => start('p'),
            'd': () => start('d'),
            'l': () => start('l'),
            'v': () => start('v'),
            'c': () => confirm('清空画布？') && clear(),
            'deleteNode': () => selectedDrawingId && deleteDrawing(selectedDrawingId, false),
            'shift+del': () => selectedDrawingId && deleteDrawing(selectedDrawingId, true),
            'left': () => offset(selectedDrawingId, 'left'),
            'right': () => offset(selectedDrawingId, 'right'),
            'up': () => offset(selectedDrawingId, 'up'),
            'down': () => offset(selectedDrawingId, 'down'),
        }
    }

    componentDidMount() {
        const updateSize = () => {
            const { clientWidth: width, clientHeight: height } = this.containerNode;
            this.setState({ width, height });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        window.addEventListener('mouseup', () => this.handleMouseUp());
    }

    private renderDrawing(drawing: Drawing) {
        const { attributes } = this.props;
        const attribute = getAttributeWithDefault(drawing, attributes[drawing.id]);
        const className = classnames(`drawing drawing-${drawing.type}`, { 
            'interactive': this.interact.isActived(drawing),
            'selected': this.props.ui.selectedDrawingId == drawing.id,
            'visible': attribute.visible,
            'track-visible': attribute.trackVisible
        });
        return (
            <g key={drawing.id} className={className}>
            { 
                drawing.type == 'p' ? this.renderStaticPoint(drawing) :
                drawing.type == 'd' ? this.renderDynamicPoint(drawing) :
                drawing.type == 'l' ? this.renderLine(drawing) :
                drawing.type == 'v' ? this.renderPath(drawing) : null
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
            <g className={classnames({ 'show-track': this.props.ui.showAllTrack })}>
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
        return (
            <g>
                <path d={resolvePathString(drawing, this.drawings, this.ui.tween, true) || "M 0 0"} />
            </g>
        );
    }

    private getPointPosition(id: string, t = this.ui.tween) {
        return getPointPosition(id, this.drawings, t);
    }

    private generateViewBox() {
        const width = this.state.width;
        const height = this.state.height;
        const left = -Math.floor(width / 2);
        const top = -Math.floor(height / 2);
        return [left, top, width, height].join(' ');
    }

    /**
     *  处理视野拖放
     */
    private view = {
        dragging: false,
        dragPosition: { x: 0, y: 0 },
        moved: false,
        dragStart: (x: number, y: number) => {
            this.view.dragging = true
            this.view.dragPosition = { x, y };
            this.view.moved = false;
            this.setState({ dragging: true });
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
            this.view.moved = true;
        },
        dragEnd: () => {
            if (this.view.dragging && !this.view.moved) {
               this.actions.start('idle');
            }
            this.view.dragging = false;
            this.setState({ dragging: false });
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
            const { params = [] } = this.ui;
            for (let param of params) {
                if (param == drawing.id) {
                    return true;
                }
            }
            return false;
        },
        active: (drawing: Drawing) => {
            const { mode, params } = this.ui;
            const { selectDrawing, next } = this.actions;
            switch (mode) {
                case "idle":
                    selectDrawing(drawing ? drawing.id : null);
                    break;
                case "p":
                    next(this.state.mouseX, this.state.mouseY);
                    break;
                case "d":
                case "l":
                    const isPoint = drawing && (drawing.type == 'p' || drawing.type == 'd');
                    if (isPoint && !this.interact.isActived(drawing)) {
                        next(drawing.id);
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
                if (drawing.type == 'p') {
                    this.interact._draggingPoint = drawing;
                }
                this.interact._startDrawing = drawing;
            }
            this.interact.active(drawing);
            this.interact._hasMoved = false;
            this.interact._started = true;
        },
        move: (x: number, y: number) => {
            const point = this.interact._draggingPoint;
            if (point) {
                point.x = x;
                point.y = y;
                this.props.actions.updateDrawing(point);
            }
            this.interact._hasMoved = true;
        },
        end: () => {
            if (this.interact._started && !this.interact._hasMoved) {
                //this.interact.active(this.interact._startDrawing);
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
        const { offsetTop, offsetLeft } = this.state;
        const clientPoint = this.svgNode.createSVGPoint();
        clientPoint.x = e.clientX + offsetLeft;
        clientPoint.y = e.clientY + offsetTop;
        const svgPoint = clientPoint.matrixTransform(this.svgNode.getScreenCTM().inverse());
        this.setState({ mouseX: svgPoint.x, mouseY: svgPoint.y });
        return { x: Math.round(svgPoint.x), y: Math.round(svgPoint.y) };
    }
}