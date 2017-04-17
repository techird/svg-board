import * as classnames from 'classnames';
import * as React from "react";
import * as TransitionGroup from "react-addons-css-transition-group";
import * as ReactClickOutside from "react-click-outside";
import ScrollArea from "react-scrollbar";
import { slide } from "../helpers/"
import { Doc as DocModel } from "../models";
import { RootState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";


const DOC_EXTENSION = '.svgboard.json';
const DOC_VERSION = "1.0.0";

interface Doc extends DocModel {
    id: string;
    active: boolean;
}

interface HeaderProps {
    docs: Doc[];
    activeDoc: Doc;
    actions: typeof actions.doc;
}

@connect(
    function mapStateToProps(state: RootState) {
        let activeDoc: Doc;
        const docs = state.docIds.map(id => {
            const doc = state.docs[id];
            const item = { ...doc,
                id,
                active: id == state.activeDocId
            } as Doc
            if (item.active) {
                activeDoc = item;
            }
            return item;
        });
        return { docs, activeDoc };
    },
    function mapDispatchToProps(dispatch) {
        return {
            actions: bindActionCreators(actions.doc, dispatch)
        };
    }
)
@ReactClickOutside
export class Tabs extends React.Component<Partial<HeaderProps>, any> {
    state = {
        menu: false,
    }

    lastClickElement: EventTarget;

    render() {
        const { docs, activeDoc, actions } = this.props;
        return (
            <div className="tabs" onClick={e => this.closeMenu()}>
                <div className="tab-container"
                    onClick={e => this.lastClickElement = e.target}
                    onDoubleClick={e => {
                        if (e.target != this.lastClickElement) {
                            return;
                        }
                        actions.new('新画板');
                    }}
                >
                    <ScrollArea speed={0.8} smoothScrolling horizontal={true} vertical={false} swapWheelAxes>
                        <TransitionGroup component="ul" {...slide({ x: 20, y: 0 })}>
                            { docs.map(doc => (
                                <DocTab
                                    key={doc.id}
                                    doc={doc} 
                                    only={docs.length == 1}
                                    onOpen={actions.switch} 
                                    onDelete={actions.delete}
                                    onRename={actions.rename}
                                />
                            ))}
                        </TransitionGroup>
                    </ScrollArea>
                </div>
                <a className="doc-menu" onClick={e => this.state.menu || this.openMenu(e)}>
                    <i className="material-icons">menu</i>
                </a>
                <div className={classnames("doc-action", { active: this.state.menu })}>
                    <a className="new-doc" onClick={e => actions.new('新画板')}>
                        <i className="material-icons">add</i>
                        <span>新画布</span>
                    </a>
                    <a className="import-doc">
                        <i className="material-icons">folder_open</i>
                        <span>导入</span>
                        <input type="file" accept={DOC_EXTENSION} onChange={e => this.importDoc(e)} />
                    </a>
                    <a className="export-doc" onClick={e => this.exportDoc(e)}>
                        <i className="material-icons">file_download</i>
                        <span>导出</span>
                    </a>
                </div>
            </div>
        );
    }

    handleClickOutside() {
        this.closeMenu();
    }

    openMenu(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation();
        this.setState({ menu: true });
    }

    closeMenu() {
        this.setState({ menu: false });
    }

    importDoc(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files.item(0);
            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                let content: any;
                try {
                    content = JSON.parse(reader.result);
                    if (content.version !== DOC_VERSION) {
                        alert('无法导入该文件，因为文件版本不匹配');
                    }
                    if (!content.docs || !content.docs.length) {
                        alert('无法导入该文件，因为文件没有包含任何文档');
                    }
                } catch (e) {
                    alert('无法导入该文件，因为文件不是正确的 JSON 格式')
                }
                const docs: DocModel[] = content.docs;
                docs.forEach(doc => this.props.actions.import(doc));
            });
            reader.readAsText(file, 'utf8');
            e.target.value = "";
        }
    }

    exportDoc(e: React.MouseEvent<HTMLAnchorElement>) {
        const version = DOC_VERSION;
        const docs = this.props.docs.map((doc) => {
            const clone = {...doc};
            delete clone.id;
            delete clone.idMap;
            delete clone.active;
            return clone;
        });
        const [doc] = docs;
        const data = { version, docs };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'octet/stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        let filename = '所有画布.svgboard.json';
        if (doc) {
            filename = doc.name;
            if (docs.length > 1) {
                filename += `等${docs.length}个画布`;
            }
            filename += '.svgboard.json';
        }
        a.href = url;
        a.download = filename;
        a.click();
    }
}

interface DocTabProps {
    doc: Doc;
    only: boolean;
    onOpen: (id: string) => void;
    onDelete: (id: string) => void;
    onRename: (id: string, name: string) => void;
}

@ReactClickOutside
class DocTab extends React.Component<DocTabProps, any> {
    state = {
        confirming: false,
        renaming: false,
        newDocName: "",
    }

    renameInput: HTMLInputElement;

    render() {
        const { confirming, renaming, newDocName } = this.state;
        const { doc, only, onOpen, onDelete } = this.props;
        return (
            <li className={classnames('tab', { confirming, active: doc.active, renaming, only })}
                onClick={e => { e.stopPropagation(); onOpen(doc.id)} }>
                <div
                    className="doc-item-wrapper"
                    onDoubleClick={e => this.rename(e)}
                    >
                    { renaming ?
                    <input className="doc-rename"
                        ref={input => this.renameInput = input}
                        value={newDocName}
                        onChange={e => this.setState({ newDocName: e.target.value })}
                        onKeyDown={e => this.handleRenameKeydown(e)}
                    /> :
                    <span className="doc-name"  >
                        {doc.name}
                    </span>
                    }
                </div>
                <a className="delete" 
                    onClick={e => {
                        e.stopPropagation();
                        this.setState({ confirming: true }); 
                    }}
                >X</a>
                <a className="delete-confirm" onClick={e => {
                    e.stopPropagation();
                    this.setState({ confirming: false });
                    onDelete(doc.id);
                }}>删除</a>
            </li>
        );
    }

    rename(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        this.setState({
            renaming: true,
            newDocName: this.props.doc.name
        });
        setTimeout(() => {
            if (this.renameInput) {
                this.renameInput.select();
            }
        });
    }

    commitRename() {
        const { renaming, newDocName } = this.state;
        if (renaming && newDocName) {
            this.props.onRename(this.props.doc.id, newDocName);
        }
    }

    handleClickOutside() {
        this.commitRename();
        this.setState({ confirming: false, renaming: false });
    }

    handleRenameKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode == 13) {
            this.commitRename();
            this.setState({ renaming: false });
        }
        if (e.keyCode == 27) {
            this.setState({ renaming: false });
        }
    }
}