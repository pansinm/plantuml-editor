import { useRecoilValue } from "recoil";
import { TreeNode } from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import "./DirectoryItem.css";
import Toolbar from "./Toolbar";
import { activatedFileState } from "../store";

export default function DirectoryItem({ treeNode }: { treeNode: TreeNode }) {
  const activatedFile = useRecoilValue(activatedFileState);
  return (
    <div
      className={`DirectoryItem ${
        activatedFile === treeNode.uri ? "active" : ""
      }`}
    >
      <div className="Directory__Item">
        <FileItemWithFileIcon treeNode={treeNode} />
      </div>
      <Toolbar treeNode={treeNode} />
    </div>
  );
}
