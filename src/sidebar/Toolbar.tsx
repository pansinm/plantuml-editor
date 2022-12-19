import { TreeNode, utils } from "@sinm/react-file-tree";
import React from "react";
import { useRecoilState } from "recoil";
import datasource from "../datasource";
import { useCloseTab, useOpenFile } from "../hooks";
import { activatedFileState, openedFilesState, treeState } from "../store";
import "./Toolbar.css";

interface ToolbarProps {
  treeNode: TreeNode;
}

export default function Toolbar({ treeNode }: ToolbarProps) {
  const [tree, setTree] = useRecoilState(treeState);
  const [files, setTabs] = useRecoilState(openedFilesState);
  const closeTab = useCloseTab();
  const openFile = useOpenFile();

  const deleteFile: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const y = window.confirm(`Delete ${utils.getFileName(treeNode.uri)}?`);
    if (y) {
      const needClosedFiles = files.filter(
        (tab) =>
          tab === treeNode.uri ||
          tab.startsWith(
            treeNode.uri.endsWith("/") ? treeNode.uri : treeNode.uri + "/"
          )
      );
      needClosedFiles.forEach((file) => closeTab(file));
      datasource.deleteFile(treeNode.uri.slice(7));
      setTree(utils.removeTreeNode(tree, treeNode.uri));
    }
  };

  const createFile: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const parent = treeNode.uri.slice(7);
    const filename = window.prompt("Input File Name:");
    if (filename) {
      const filepath =
        (parent + "/" + encodeURIComponent(filename)).replace(/^\/+/, "/") +
        ".puml";
      const uri = "file://" + filepath;
      datasource.createFile(filepath, "file").then(() => {
        openFile(uri);
      });
      setTree(
        utils.assignTreeNode(
          utils.appendTreeNode(tree, treeNode.uri, {
            uri,
            type: "file",
          }),
          treeNode.uri,
          { expanded: true }
        )
      );
    }
  };

  const createDirectory: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const parent = treeNode.uri.slice(7);
    const filename = window.prompt("Input Directory Name:");
    if (filename) {
      const filepath = (parent + "/" + encodeURIComponent(filename)).replace(
        /^\/+/,
        "/"
      );
      datasource.createFile(filepath, "directory");
      setTree(
        utils.assignTreeNode(
          utils.appendTreeNode(tree, treeNode.uri, {
            uri: "file://" + filepath,
            type: "directory",
          }),
          treeNode.uri,
          { expanded: true }
        )
      );
    }
  };

  return (
    <div className="Toolbar">
      {treeNode.type === "directory" && (
        <>
          <span
            onClick={createFile}
            className="icon-create-file"
            title="Create File"
          ></span>
          <span
            onClick={createDirectory}
            className="icon-create-dir"
            title="Create Folder"
          ></span>
        </>
      )}
      <span onClick={deleteFile} className="icon-close" title="Delete"></span>
    </div>
  );
}
