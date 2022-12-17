import "@sinm/react-chrome-tabs/css/chrome-tabs.css";
import { useState } from "react";
import "./App.css";
import Browser from "./browser/Browser";
import DirectoryTree from "./sidebar/DirectoryTree";

function App() {
  return (
    <div className="App">
      <div className="App_Sidebar">
        {/* <div style={{ height: 46 }}>xx</div> */}
        <DirectoryTree />
      </div>
      <div className="App_Browser">
        <Browser />
      </div>
    </div>
  );
}

export default App;
