import React from "react";

class File extends React.Component {

    render() {
        return (
            <div>
                <h2>File</h2>
                <p>{this.props.name}</p>
            </div>
        );
    }
}

export default File;