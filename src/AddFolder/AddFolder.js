import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'


export default class AddFolder extends React.Component {
    static contextType = ApiContext;

    handleSubmit(event) {
        event.preventDefault();
        const folderNameInput = event.target.folderNameInput.value;
        console.log('Name: ', folderNameInput);
        this.handleAddFolder(folderNameInput);
    }

    handleAddFolder = folderName => {
        const data = { name: `${folderName}` };
        fetch(`${config.API_ENDPOINT}/folders`, {
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
              this.context.addFolder(json)
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
                <section className="AddFolder">
                    <h2>Create a folder</h2>
                    <form className="Noteful-form " action="#" onSubmit={e => this.handleSubmit(e)}>
                        <div className="field">
                            <label htmlFor="folder-name-input">Name</label>
                            <input type="text" id="folder-name-input" name="folderNameInput"></input>
                        </div>
                        <div className="buttons">
                            <button type="submit">Add folder</button>
                        </div>
                    </form>
                </section>
        )
    }
}
