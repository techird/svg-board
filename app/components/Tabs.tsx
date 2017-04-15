import * as classnames from 'classnames';
import * as React from "react";
import * as ReactClickOutside from "react-click-outside";
import { Doc as DocModel } from "../models";
import { RootState, actions } from "../redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

interface Doc extends DocModel {
    id: string;
    active: boolean;
}

interface HeaderProps {
    docs: Doc[];
    activeDoc: Doc;
    actions: typeof actions.doc
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
        switching: false,
    }

    render() {
        const { docs, activeDoc, actions } = this.props;
        return (
            <div className="tabs">
                <div className="tab-container" onDoubleClick={e => actions.new('新画板')}>
                    <ul>
                    { docs.map(doc => (
                        <DocTab
                            key={doc.id}
                            doc={doc} 
                            onOpen={actions.switch} 
                            onDelete={actions.delete}
                            onRename={actions.rename}
                        />
                    ))}
                    </ul>
                </div>
                <div className="doc-action">
                    <a className="new-doc" onClick={e => actions.new('新画板')}>新建</a>
                    <a className="import-doc">
                        <span>导入</span>
                        <input type="file" onChange={e => this.importDoc(e)} />
                    </a>
                    <a className="export-doc" onClick={e => this.exportDoc(e)}>导出</a>
                </div>
            </div>
        );
    }

    openDocSwitcher() {
        this.setState({ switching: true });
    }

    switchDoc(docId: string) {
        if (docId == this.props.activeDoc.id) return;
        this.props.actions.switch(docId);
        this.setState({ swithing: false });
    }

    importDoc(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files.item(0);
            console.log(file);
        }
    }

    exportDoc(e: React.MouseEvent<HTMLAnchorElement>) {
        const docs = this.props.docs;
        const json = JSON.stringify(docs, null, 4);
        const blob = new Blob([json], { type: 'text/json' });
        window.open(URL.createObjectURL(blob));
    }
}

interface DocTabProps {
    doc: Doc;
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
        const { doc, onOpen, onDelete } = this.props;
        return (
            <li className={classnames('tab', { confirming, active: doc.active, renaming })}
                onClick={e => { e.stopPropagation(); onOpen(doc.id)} }
                onDoubleClick={e => this.rename(e)}>
                <div className="doc-item-wrapper">
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
                <a className="delete" onClick={e => {
                    e.stopPropagation();
                    this.setState({ confirming: true }); 
                }}>X</a>
                <a className="delete-confirm" onClick={e => {
                    e.stopPropagation();
                    onDelete(doc.id);
                    this.setState({ confirming: false });
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
        //this.setState({ renaming: false, switching: false });
    }
}