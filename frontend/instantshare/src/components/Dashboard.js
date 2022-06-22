import React from "react";
import File from "./File";
import Uploader from "./Uploader"
class Dashboard extends React.Component {
    render() {
        return (
            <div>
                
                <h1>This is a Dashboard Component</h1>
                
                <File />
                <Uploader></Uploader>
            </div>
        );
    }
}

export default Dashboard;