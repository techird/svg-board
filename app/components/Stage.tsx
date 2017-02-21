import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classnames from "classnames";
import { RootState, isStaticPoint, isDynamicPoint, isLine, Drawing, StaticPoint, DynamicPoint, Line } from "../models";
import { interactActions } from "../actions/interactActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

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
                onDoubleClick={() => this.resetView()}>
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

    private renderDrawing(drawing: Drawing) {
        return (
            <g key={drawing.id} className={classnames(drawing.type, { interactive: this.isDrawingInteractive(drawing) })}>
            { 
                isStaticPoint(drawing) ? this.renderStaticPoint(drawing) :
                isDynamicPoint(drawing) ? this.renderDynamicPoint(drawing) :
                isLine(drawing) ? this.renderLine(drawing) : null
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
        const [x, y] = this.getDrawingPosition(drawing.id);
        let track: number[] = [];
        for (let t = 0; t <= 100; t += 5) {
            track = [...track, ...this.getDrawingPosition(drawing.id, t / 100)];
        }
        return (
            <g>
                <path d={`M${track.shift()} ${track.shift()} L ${track.join(' ')}`} />
                <g transform={`translate(${x}, ${y})`}>
                    <circle className="dynamic-point" r="5" onMouseDown={e => this.handleMouseDown(e, drawing)} />
                    <text textAnchor="middle" dy="15">{`${drawing.id}(${x.toFixed(0)}, ${y.toFixed(0)})`}</text>
                </g>
            </g>
        );
    }

    private renderLine(drawing: Line) {
        const [x1, y1] = this.getDrawingPosition(drawing.from);
        const [x2, y2] = this.getDrawingPosition(drawing.to);
        return (
            <g>
                <line className="line" {...{x1, y1, x2, y2}}></line>
            </g>
        );
    }

    private isDrawingInteractive(drawing: Drawing) {
        const { interactiveParams = [] } = this.props;
        for (let param of interactiveParams) {
            if (param == drawing.id) {
                return true;
            }
        }
        return false;
    }

    private getDrawingPosition(id: string, t = this.props.tween, path: string[] = []): [number, number] {
        if (path.indexOf(id) > -1) return [0, 0];
        path.push(id);
        const drawing = this.props.drawingList.find(x => x.id == id);
        if (!drawing) return [0, 0];
        if (isStaticPoint(drawing)) {
            path.pop();
            return [drawing.x, drawing.y];
        }
        if (isDynamicPoint(drawing)) {
            const [fx, fy] = this.getDrawingPosition(drawing.from, t, path);
            const [tx, ty] = this.getDrawingPosition(drawing.to, t, path);
            const dx = tx - fx;
            const dy = ty - fy;
            path.pop();
            return [fx + dx * t, fy + dy * t];
        }
        path.pop();
        return [0, 0];
    }

    private generateViewBox() {
        const width = this.state.width;
        const height = this.state.height;
        const left = -Math.floor(width / 2) + this.state.offsetLeft;
        const top = -Math.floor(height / 2) + this.state.offsetTop;
        return [left, top, width, height].join(' ');
    }

    private viewDragging = false;
    private lastViewDragPosition = { x: 0, y: 0 };

    private handleMouseDown(e: React.MouseEvent<Element>, drawing?: Drawing) {
        if (e.button == 2) {
            this.viewDragging = true;
            this.lastViewDragPosition = { x: e.pageX, y: e.pageY };
        }
        if (e.button == 0) {
            const { interactiveMode, interactiveParams, interactActions } = this.props;

            if (interactiveMode == "static-point") {
                interactActions.next(this.state.mouseX, this.state.mouseY);
            }
            if (interactiveMode == "line" || interactiveMode == "dynamic-point") {
                if (drawing && !this.isDrawingInteractive(drawing) && (isStaticPoint(drawing) || isDynamicPoint(drawing))) {
                    interactActions.next(drawing.id);
                }
            }
            if (interactiveMode == "none" && drawing) {
                interactActions.activeDrawing(drawing.id);
            }
        }
        e.stopPropagation();
    }

    private handleMouseMove(e: React.MouseEvent<Element>) {
        if (this.viewDragging) {
            const currentViewDragPosition = { x: e.pageX, y: e.pageY };
            const dx = currentViewDragPosition.x - this.lastViewDragPosition.x;
            const dy = currentViewDragPosition.y - this.lastViewDragPosition.y;
            this.setState({
                offsetLeft: this.state.offsetLeft - dx,
                offsetTop: this.state.offsetTop - dy
            });
            this.lastViewDragPosition = currentViewDragPosition;
        }

        const clientPoint = this.svgNode.createSVGPoint();
        clientPoint.x = e.clientX;
        clientPoint.y = e.clientY;
        const svgPoint = clientPoint.matrixTransform(this.svgNode.getScreenCTM().inverse());
        this.setState({ mouseX: svgPoint.x, mouseY: svgPoint.y });

        if (this.props.activeDrawingId) {
            this.props.interactActions.updateDrawing({
                x: svgPoint.x,
                y: svgPoint.y
            });
        }
    }

    private handleMouseUp() {
        this.viewDragging = false;
        if (this.props.activeDrawingId) {
            this.props.interactActions.activeDrawing(null);
        }
    }

    private resetView() {
        this.setState({ offsetLeft: 0, offsetTop: 0 });
    }
}