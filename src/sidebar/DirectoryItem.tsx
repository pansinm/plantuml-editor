import { TreeNode } from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import "./DirectoryItem.css";
import Toolbar from "./Toolbar";

export default function DirectoryItem({ treeNode }: { treeNode: TreeNode }) {
  return (
    <div className="DirectoryItem">
      <div className="Directory__Item">
        <FileItemWithFileIcon treeNode={treeNode} />
      </div>
      <Toolbar treeNode={treeNode}/>
    </div>
  );
}
