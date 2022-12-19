import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { contentState } from "../store";
import "./Previewer.css";
const { encode } = require("plantuml-encoder");

export default function Previewer() {
  const [content] = useRecoilState(contentState);
  const url = "http://www.plantuml.com/plantuml/svg/" + encode(content);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
  }, [url]);
  return (
    <div className="Previewer">
      <img
        alt="PlantUML Diagram"
        src={url}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      ></img>
      {loading && <div className="Previewer__loading">Loading</div>}
      <div className="Previewer__Footer">
        <span style={{color: '#333', marginRight: 10}}>All data stored in local IndexDB</span>
        <a href="https://github.com/pansinm/plantuml-editor">
          <span className="fa fa-github"></span>
        </a>
      </div>
    </div>
  );
}
