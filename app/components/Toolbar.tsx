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
export class Toolbar extends React.Component<ToobarProps, any> {
    state = {
        playing: false
    }

    render() {
        const { interactiveMode: mode, interactActions: actions, tween } = this.props;
        return (
            <div className="toolbar">
                <button disabled={mode == "static-point"} onClick={() => actions.start('static-point')}>端点</button>
                <button disabled={mode == "dynamic-point"} onClick={() => actions.start('dynamic-point')}>补间点</button>
                <button disabled={mode == "line"} onClick={() => actions.start('line')}>线段</button>
                <button>路径</button>
                <button onClick={() => this.togglePlay()}>{this.state.playing ? "暂停" : "播放"}</button>
                <input type="range" min="0" max="1" step="0.01" value={tween.toString()} onChange={e => actions.updateTween(+e.target['value'])} />{tween.toFixed(2)}
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