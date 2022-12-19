import { Tabs } from "@sinm/react-chrome-tabs";
import React from "react";
import { useRecoilValue } from "recoil";
import Editor from "./Editor";
import "./Browser.css";
import Previewer from "./Previewer";
import { activatedFileState, openedFilesState } from "../store";
import { utils } from "@sinm/react-file-tree";
import { getFileIconClass } from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import { TabProperties } from "@sinm/react-chrome-tabs/dist/chrome-tabs";
import { useCloseTab, useOpenFile, useReorder } from "../hooks";

export default function Browser() {
  const files = useRecoilValue(openedFilesState);
  const closeTab = useCloseTab();
  const reorderTab = useReorder();
  const activeTab = useOpenFile();
  const activatedFile = useRecoilValue(activatedFileState);
  if (!files.length) {
    return null;
  }

  const tabs: TabProperties[] = files.map((file) => ({
    id: file,
    title: utils.getFileName(file),
    faviconClass: getFileIconClass(utils.getFileName(file), false),
    active: file === activatedFile,
  }));

  return (
    <div className="Browser">
      <Tabs
        tabs={tabs}
        onTabActive={activeTab}
        onTabClose={closeTab}
        onTabReorder={reorderTab}
      />
      <div className="Browser_Content">
        <div className="Browser_Editor">
          <Editor />
        </div>
        <div className="Browser_Previewer">
          <Previewer />
        </div>
      </div>
    </div>
  );
}
