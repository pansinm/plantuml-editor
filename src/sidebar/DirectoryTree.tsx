import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  FileTree,
  FileTreeProps,
  TreeNode,
  utils,
} from "@sinm/react-file-tree";
import "@sinm/react-file-tree/icons.css";
import "@sinm/react-file-tree/styles.css";
import { activatedFileState, treeState } from "../store";
import datasource from "../datasource";
import DirectoryItem from "./DirectoryItem";
import FileItem from "./FileItem";

const itemRenderer = (treeNode: TreeNode) => {
  if (treeNode.type === "directory") {
    return <DirectoryItem treeNode={treeNode} />;
  }
  return <FileItem treeNode={treeNode} />;
};

function DirectoryTree() {
  const tree = useRecoilValue(treeState);
  const setTree = useSetRecoilState(treeState);
  const activatedFile = useRecoilValue(activatedFileState);
  const setActivatedFile = useSetRecoilState(activatedFileState);

  useEffect(() => {
    datasource.getTree().then(async (_tree) => {
      let initTree = _tree;
      if (!_tree) {
        await datasource.createFile("/", "directory");
        initTree = {
          uri: "file:///",
          type: "directory",
          children: [],
        };
      }
      Object.assign(initTree || {}, { expanded: true });
      setTree(initTree);
    });
  }, []);

  const handleClick: FileTreeProps["onItemClick"] = (treeNode) => {
    if (treeNode.type === "directory") {
      setTree(
        utils.assignTreeNode(tree, treeNode.uri, {
          expanded: !treeNode.expanded,
        })
      );
    } else {
      setActivatedFile(treeNode.uri);
    }
  };

  return (
    <FileTree
      tree={tree}
      itemRenderer={itemRenderer}
      onItemClick={handleClick}
    />
  );
}

export default DirectoryTree;
