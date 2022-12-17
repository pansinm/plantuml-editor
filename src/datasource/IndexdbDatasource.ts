import { TreeNode } from "@sinm/react-file-tree";
import Dexie, { Table } from "dexie";

type FileType = "directory" | "file";

export type File = {
  id?: number;
  path: string;
  content: string;
  type: FileType;
  createdAt: number;
  updatedAt: number;
};

class IndexdbDatasource extends Dexie {
  private files!: Table<File, number>;
  constructor() {
    super("plantuml_editor_db");
    this.version(1).stores({
      files: "++id,&path,content,updatedAt,createdAt",
    });
  }

  async createFile(path: string, type: FileType) {
    const file = await this.files.get({ path });
    if (!file) {
      const file = {
        path,
        content: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type,
      };
      const id = await this.files.add(file);
      return {
        ...file,
        id,
      };
    }
    throw new Error(`${path} exists`);
  }

  async getFile(path: string) {
    return this.files.get({path})
  }

  async updateFile(path: string, content: string) {
    const id = await this.files.get({ path });
    if (id) {
      await this.files.update(id, { content });
    }
    throw new Error(`${path} exists`);
  }

  async deleteFile(path: string) {
    const children = await this.files
      .where("path")
      .startsWith(path + "/")
      .primaryKeys();
    const file = await this.files.get({ path });
    await this.files.bulkDelete(children);
    if (file?.id) {
      await this.files.delete(file.id);
    }
  }

  parentPath(path: string) {
    const segments = path.split("/");
    segments.pop();
    return segments.join("/");
  }

  async rename(path: string, name: string) {
    const file = await this.files.get({ path });
    const segments = path.split("/");
    segments.pop();
    const newpath = segments.concat(name).join("/");
    if (file?.type === "directory") {
      const files = await this.files
        .where("path")
        .startsWith(path + "/")
        .toArray();
      await Promise.all(
        files.map((file) =>
          this.files.update(file, {
            path: file.path.replace(path, newpath),
          })
        )
      );
    }
    if (file?.id) {
      await this.files.update(file.id, { path: newpath });
    }
  }

  private fileToTree(files: File[]) {
    const map: { [key: string]: TreeNode } = {};
    for (let file of files) {
      file.path.split("/").reduce((parent, seg) => {
        if (!map[parent]) {
          map[parent] = {
            type: "directory",
            uri: "file://" + parent,
            children: [],
          };
        }
        const path = [parent, seg].join("/");
        return path;
      }, "/");

      map[file.path] = {
        ...file,
        uri: "file://" + file.path,
      };
    }
    Object.values(map).forEach((node) => {
      const path = node.uri.slice(7);
      const parent = this.parentPath(path);
      if (map[parent]) {
        map[parent].children?.push(node);
      }
    });
    return map["/"];
  }

  async getTree() {
    const all = await this.files.toArray();
    if (!all.length) {
      return undefined;
    }
    return this.fileToTree(all);
  }
}

export default IndexdbDatasource;
