import { Tabs } from "@sinm/react-chrome-tabs";
import React from "react";
import Editor from "./Editor";
import "./Browser.css";
import Previewer from "./Previewer";

export default function Browser() {
  return (
    <div className="Browser">
      <Tabs tabs={[]} />
      <div className="Browser_Content">
        <div className="Browser_Editor">
          <Editor />
        </div>
        <div className="Browser_Previewer">
          <Previewer />
        </div>
      </div>
    </div>
  );
}
