import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'


export default class AddNote extends React.Component {
    static contextType = ApiContext;

    handleSubmit(event) {
        event.preventDefault();
        const noteNameInput = event.target.noteNameInput.value;
        const noteContentInput = event.target.noteContentInput.value;
        const folderId = event.target.folderSelect.value;
        //console.log(folderSelect)
        let validateResult = this.validate(noteNameInput, folderId);
        if (validateResult) {
            alert(validateResult);
        }
        else {
            this.handleAddNote(noteNameInput, noteContentInput, folderId);
        }
    }

    validate(name, folderId) {
        const nameTrimmed = name.trim();
        if (nameTrimmed.length < 1) {
          return 'Note name cannot be empty';
        } 
        if (!folderId) {
            return 'Folder is invalid';
        }
      }

    handleAddNote(noteNameInput, noteContentInput, folderId) {
        const data = {
            name: `${noteNameInput}`,
            content: `${noteContentInput}`,
            modified: `${(new Date()).toISOString()}`,
            folderId: `${folderId}`,
        };
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then((json) => {
                this.context.addNote(json)
                // allow parent to perform extra behaviour
                //this.props.onDeleteNote(noteId)
                this.props.history.push(`/`)
            })
            .catch(error => {
                console.error({ error })
            })
    }

    render() {
        return (
            <section className="AddNote">
                <h2>Create a note</h2>
                <form className="Noteful-form " action="#" onSubmit={e => this.handleSubmit(e)}>
                    <div className="field">
                        <label htmlFor="note-name-input">Name</label>
                        <input type="text" id="note-name-input" name="noteNameInput" />
                    </div>
                    <div className="field">
                        <label htmlFor="note-content-input">Content</label>
                        <textarea id="note-content-input" name="noteContentInput" />
                    </div>
                    <div className="field">
                        <label htmlFor="note-folder-select">Folder</label>
                        <select id="note-folder-select" name="folderSelect">
                            {this.context.folders.map((folder) =>
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="buttons">
                        <button type="submit">Add note</button>
                    </div>
                </form>
            </section>
        )
    }
}

