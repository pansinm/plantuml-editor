import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { PUmlExtension } from "@sinm/monaco-plantuml";
import { useMeasure, useMount } from "react-use";
import "./Editor.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activatedFileState, contentState } from "../store";
import datasource from "../datasource";

monaco.languages.register({ id: "vs.editor.nullLanguage" });
monaco.languages.setLanguageConfiguration("vs.editor.nullLanguage", {});

const worker = new Worker(new URL("./worker", import.meta.url));
const extension = new PUmlExtension(worker);

export default function Editor() {
  const ref = useRef<HTMLDivElement>(null);
  const [setEle, { width, height }] = useMeasure();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const activeFile = useRecoilValue(activatedFileState);
  const setContent = useSetRecoilState(contentState);

  useEffect(() => {
    const path = activeFile.slice(7);
    datasource.getFile(path).then((file) => {
      if (file) {
        const uri = monaco.Uri.parse("file://" + file.path);
        let model = monaco.editor.getModel(uri);
        if (!model) {
          model = monaco.editor.createModel(file.content, "plantuml", uri);
        }
        editorRef.current?.setModel(model);
      }
    });
  }, [activeFile]);

  useEffect(() => {
    const editor = monaco.editor.create(ref.current as HTMLDivElement, {
      language: "plantuml",
    });
    editorRef.current = editor;

    editor.onDidChangeModelContent((e) => {
      const uri = editor.getModel()?.uri.toString();
      if (uri) {
        datasource.updateFile(uri.slice(7), editor.getValue());
      }
      setContent(editor.getValue());
    });

    editor.onDidChangeModel(() => {
      setContent(editor.getValue());
    });

    const disposer = extension.active(editorRef.current);
    const model = editorRef.current.getModel();
    monaco.editor.setModelLanguage(model!, "plantuml");
    setEle(ref.current?.parentElement as HTMLDivElement);
    return () => {
      editorRef.current?.dispose();
      disposer.dispose();
    };
  }, []);

  useEffect(() => {
    editorRef.current?.layout();
  }, [width, height]);

  return <div className="Editor" ref={ref}></div>;
}
