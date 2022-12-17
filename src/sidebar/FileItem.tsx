import { TreeNode } from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";

export default function FileItem({ treeNode }: { treeNode: TreeNode }) {
  return (
    <div>
      <div>
        <FileItemWithFileIcon treeNode={treeNode} />
      </div>
      <div>
        <span>-</span>
        <span>+</span>
        <span>x</span>
      </div>
    </div>
  );
}
