import logo from './logo.svg';
import './App.css';
import File from './components/File';
import Dashboard from './components/Dashboard';
import { Component } from 'react';
import axios from 'axios';
import Api from './Api';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      files: []
    };
    this.onNewBoard = this.onNewBoard.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onDeleteBoard = this.onDeleteBoard.bind(this);
  }

  onNewBoard() {
    Api.post("/board").then((res) => {
      console.log(res.data);
      this.setState({board: res.data});
    });
  };

  onRefresh() {
    Api.get(`/board/${this.state.board.id}/files`).then((res) => {
      this.setState({files: res.data})
    })

  }
  onDeleteBoard() {
    Api.delete(`/board/${this.state.board.id}`).then((res)=> {
      this.setState({board: null, files: []})
    })
  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
        
        <button onClick={this.onRefresh}>Refresh</button>
        <button onClick={this.onNewBoard}>New Board</button>
        <button onClick={this.onDeleteBoard}>Delete Board</button>
        {this.state.board && <Dashboard boardname={this.state.board.name} boardid={this.state.board.id} files={this.state.files}/> }
      </header>
      
    </div>
  );
    }
}

export default App;
