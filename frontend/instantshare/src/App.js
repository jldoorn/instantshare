import logo from './logo.svg';
import './App.css';
import File from './components/File';
import Dashboard from './components/Dashboard';
import { Component } from 'react';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      files: []
    };
    this.onNewBoard = this.onNewBoard.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onNewBoard() {

  }
  onRefresh() {

  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
        
        <button onClick={onRefresh}>Refresh</button>
        <button onClick={onRefresh}>New Board</button>
        <Dashboard />
      </header>
      
    </div>
  );
    }
}

export default App;
