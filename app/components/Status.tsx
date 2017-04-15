import * as classnames from 'classnames';
import * as React from "react";
import { RootState, UIState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ToobarProps extends UIState {
    actions: typeof actions.ui
}

@connect(
    function mapStateToProps(state: RootState) {
        return state.ui;
    },
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions.ui, dispatch)
        };
    }
)
export class StatusBar extends React.Component<Partial<ToobarProps>, any> {
    state = {
        playing: false
    }

    render() {
        const { mode, tween, actions } = this.props;
        const { playing } = this.state;
        return (
            <div className="status-bar">
                <div className="info">
                    { mode == 'idle' &&
                        <div>右键拖动画布，双击重置</div>
                    }
                    { mode == 'p' &&
                        <div>在画布上点击生成可拖动的点</div>
                    }
                    { mode == 'd' &&
                        <div>选择画布上的两个点创建其补间点</div>
                    }
                    { mode == 'l' &&
                        <div>选择画布上的两个点创建线段</div>
                    }
                </div>
                <div className="tools">
                    <div className="tween-player">
                        <a title={playing ? "暂停" : "播放"} className={classnames({ playing })} onClick={() => this.togglePlay()}>{playing ? "暂停" : "播放"}</a>
                        <input type="range" min="0" max="1" step="0.01" value={tween.toString()} onChange={e => actions.updateTween(+e.target['value'])} />
                        <span>{tween.toFixed(2)}</span>
                    </div>
                </div>
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
                this.props.actions.updateTween(tween);
                lastTime = currentTime;
                requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            this.setState({ playing: true });
        }
    }
}