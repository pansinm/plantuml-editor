import { useRecoilState } from "recoil";
import { activatedFileState, openedFilesState } from "../store";

export function useOpenFile() {
  const [files, setFiles] = useRecoilState(openedFilesState);
  const [, setActiveFile] = useRecoilState(activatedFileState);

  return (uri: string) => {
    if (!files.find((file) => file === uri)) {
      setFiles([...files, uri]);
    }
    setActiveFile(uri);
  };
}

export const useActiveTab = () => {
  const [, setActiveFile] = useRecoilState(activatedFileState);
  return (id: string) => setActiveFile(id);
};

export const useCloseTab = () => {
  const [files, setFiles] = useRecoilState(openedFilesState);
  const [activatedFile, setActiveFile] = useRecoilState(activatedFileState);
  return (uri: string) => {
    let activeFile = "";
    files.forEach((file, index) => {
      if (file === uri && file === activatedFile) {
        const activeTabFile = files[index + 1] || files[index - 1];
        if (activeTabFile) {
          activeFile = activeTabFile;
        }
      }
    });
    setFiles((files) => files.filter((tab) => tab !== uri));
    setActiveFile(activeFile);
  };
};

export const useReorder = () => {
  const [tabs, setTabs] = useRecoilState(openedFilesState);
  return (tabId: string, fromIndex: number, toIndex: number) => {
    const beforeTab = tabs.find((tab) => tab === tabId);
    if (!beforeTab) {
      return;
    }
    let newTabs = tabs.filter((tab) => tab !== tabId);
    newTabs.splice(toIndex, 0, beforeTab);
    setTabs(newTabs);
  };
};
