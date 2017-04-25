import * as classnames from 'classnames';
import * as React from "react";
import { RootState, UIState, UIMode, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface ToobarProps extends UIState {
    actions: typeof actions.ui
}

const CREATE_TOOLS = [
    { mode: 'p' as UIMode, title: '创建静态点' },
    { mode: 'd' as UIMode, title: '创建补间点' },
    { mode: 'l' as UIMode, title: '创建线段' },
    { mode: 'v' as UIMode, title: '创建路径' },
    { mode: 'p' as UIMode, title: '创建静态点' },
]

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
export class Toolbar extends React.Component<Partial<ToobarProps>, any> {
    render() {
        const { mode, tween, actions } = this.props;
        return (
            <div className="toolbar">
                <div>
                    <button 
                        title="创建静态点"
                        className={classnames({ active: mode == 'p' })}
                        onClick={() => actions.start(mode == 'p' ? 'idle' : 'p')}>
                        P
                    </button>
                    <button 
                        title="创建补间点"
                        className={classnames({ active: mode == 'd' })}
                        onClick={() => actions.start(mode == 'd' ? 'idle' : 'd')}>
                        D
                    </button>
                    <button 
                        title="创建线段"
                        className={classnames({ active: mode == 'l' })}
                        onClick={() => actions.start(mode == 'l' ? 'idle' : 'l')}>
                        L
                    </button>
                    <button 
                        title="创建路径"
                        className={classnames({ active: mode == 'v' })}
                        onClick={() => { actions.start(mode == 'v' ? 'idle' : 'v'); actions.next('M 0 0') }}>
                        V
                    </button>
                    <hr className="spliter" />
                    <button 
                        title="清空画布"
                        className="clear" onClick={() => confirm('清空画布？') && actions.clear()}>C</button>
                </div>
            </div>
        );
    }
}