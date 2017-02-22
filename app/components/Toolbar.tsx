import * as React from "react";
import { RootState } from "../models";
import { interactActions } from "../actions/interactActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ToobarProps extends RootState {
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
export class Toolbar extends React.Component<Partial<ToobarProps>, any> {
    state = {
        playing: false
    }

    render() {
        const { interactiveMode: mode, interactActions: actions, tween } = this.props;
        return (
            <div className="toolbar">
                { mode == 'none' &&
                    <div>
                        <button onClick={() => actions.start('static-point')}>端点</button>
                        <button onClick={() => actions.start('dynamic-point')}>补间点</button>
                        <button onClick={() => actions.start('line')}>线段</button>
                        <button onClick={() => { actions.start('path'); actions.next('M 0 0') }}>路径</button>
                        <button onClick={() => this.togglePlay()}>{this.state.playing ? "暂停" : "播放"}</button>
                        <input type="range" min="0" max="1" step="0.01" value={tween.toString()} onChange={e => actions.updateTween(+e.target['value'])} />{tween.toFixed(2)}
                        <label>
                            <input type="checkbox" checked={this.props.showAllTrack} onChange={e => this.props.interactActions.showAllTrack(!this.props.showAllTrack)} />
                            显示所有补间点轨迹
                        </label>
                    </div>
                }
                { mode == 'static-point' &&
                    <div>在画布上点击生成可拖动的点 <button onClick={() => actions.start('none')}>取消</button></div>
                }
                { mode == 'dynamic-point' &&
                    <div>选择画布上的两个点创建其补间点 <button onClick={() => actions.start('none')}>取消</button></div>
                }
                { mode == 'line' &&
                    <div>选择画布上的两个点创建线段 <button onClick={() => actions.start('none')}>取消</button></div>
                }
            </div>
        );
    }

    togglePlay() {
        if (this.state.playing) {
            this.setState({ playing: false });
        } else {
            let lastTime = +new Date();
            const update = () => {
                if (!this.state.playing) return;
                let tween = this.props.tween;
                let currentTime = +new Date();
                tween += Math.min(currentTime - lastTime, 100) / 5000;
                if (tween > 1) tween = 0;
                this.props.interactActions.updateTween(tween);
                lastTime = currentTime;
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            this.setState({ playing: true });
        }
    }
}