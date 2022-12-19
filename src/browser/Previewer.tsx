import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { contentState } from "../store";
const { encode } = require("plantuml-encoder");

export default function Previewer() {
  const [content] = useRecoilState(contentState);
  const url = "http://www.plantuml.com/plantuml/svg/" + encode(content);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
  }, [url]);
  return (
    <div style={{ position: "relative" }}>
      <img
        alt="PlantUML Diagram"
        src={url}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      ></img>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: 'flex',
            alignItems:'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.8)',
            color: '#666'
          }}
        >
          Loading
        </div>
      )}
    </div>
  );
}
