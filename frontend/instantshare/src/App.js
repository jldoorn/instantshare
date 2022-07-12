import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Board from "./routes/Board";
import Layout from "./components/Layout/Layout";


function App(props) {
  return ( 
    <>
    <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:boardId" element={<Board /> } />
    </Routes>

    </Layout>
    
    </>
   );
}

export default App;
