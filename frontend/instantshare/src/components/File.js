import React from "react";

class File extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2>File</h2>
                <p>{this.props.obj.name}</p>
                <p>{this.props.obj.id}</p>
                <a href={`http://localhost:5000/board/${this.props.boardid}/files/${this.props.obj.id}`}>Download</a>
            </div>
        );
    }
}

export default File;