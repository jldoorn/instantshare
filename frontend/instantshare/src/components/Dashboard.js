import React from "react";
import File from "./File";
import Uploader from "./Uploader"
class Dashboard extends React.Component {
constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                
                <h1>This is a Dashboard Component</h1>
                <p>{this.props.boardname} {this.props.boardid}</p>
                {this.props.files.map((file) => {
                    return <File key={file.id} obj={file} boardid={this.props.boardid}></File>
                })}
                <Uploader boardid={this.props.boardid}></Uploader>
            </div>
        );
    }
}

export default Dashboard;