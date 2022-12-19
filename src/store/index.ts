import { TabProperties } from "@sinm/react-chrome-tabs/dist/chrome-tabs";
import { TreeNode } from "@sinm/react-file-tree";
import { atom } from "recoil";

export const treeState = atom<TreeNode | undefined>({
  key: "tree",
  default: undefined,
});

export const openedFilesState = atom<string[]>({
  key: "tabs",
  default: [],
});

export const activatedFileState = atom<string>({
  key: "activatedFile",
  default: "",
});

export const contentState = atom({
  key: "pumlCode",
  default: "",
});
