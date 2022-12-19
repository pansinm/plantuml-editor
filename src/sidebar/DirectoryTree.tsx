import { useEffect } from "react";
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
import { useOpenFile } from "../hooks";

const defaultC4 = `
!include <C4/C4_Container>

System_Boundary(boundary, "System Boundary"){
  System(product, "Product Service", "")
  System(price, "Price Service", "")
}
`.trim();

const itemRenderer = (treeNode: TreeNode) => {
  return <DirectoryItem treeNode={treeNode} />;
};

function DirectoryTree() {
  const tree = useRecoilValue(treeState);
  const activatedFile = useRecoilValue(activatedFileState);
  const setTree = useSetRecoilState(treeState);
  const openFile = useOpenFile();

  useEffect(() => {
    datasource.getTree().then(async (_tree) => {
      let initTree = _tree;
      if (!_tree) {
        await datasource.createFile("/", "directory");
        await datasource.createFile("/c4.puml", "file", defaultC4);
        initTree = {
          uri: "file:///",
          type: "directory",
          children: [
            {
              uri: "file:///c4.puml",
              type: "file",
            },
          ],
        };
        openFile("file:///c4.puml");
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
      openFile(treeNode.uri);
    }
  };

  return (
    <FileTree
      tree={tree}
      activatedUri={activatedFile}
      itemRenderer={itemRenderer}
      onItemClick={handleClick}
    />
  );
}

export default DirectoryTree;
