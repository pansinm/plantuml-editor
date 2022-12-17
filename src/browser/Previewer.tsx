import React from "react";
import { useRecoilState } from "recoil";
import { contentState } from "../store";
const { encode } = require("plantuml-encoder");

export default function Previewer() {
  const [content] = useRecoilState(contentState);

  const url = "http://www.plantuml.com/plantuml/img/" + encode(content);
  return (
    <div>
      <img src={url}></img>
    </div>
  );
}
