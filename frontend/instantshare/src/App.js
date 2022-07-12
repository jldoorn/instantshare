import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Board from "./routes/Board";


function App(props) {
  return ( 
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:boardId" element={<Board /> } />
    </Routes>
    </>
   );
}

export default App;
