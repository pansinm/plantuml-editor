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

  async createFile(path: string, type: FileType, content = "") {
    const file = await this.files.get({ path });
    if (!file) {
      const file = {
        path,
        content,
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
    return this.files.get({ path });
  }

  async updateFile(path: string, content: string) {
    const id = await this.files.get({ path });
    if (id) {
      await this.files.update(id, { content });
    } else {
      throw new Error(`${path} not exists!`)
    }
  }

  async deleteFile(path: string) {
    const children = await this.files
      .where("path")
      .startsWith(path.endsWith("/") ? path : path + "/")
      .primaryKeys();
    const file = await this.files.get({ path });
    await this.files.bulkDelete(children);
    if (file?.id) {
      await this.files.delete(file.id);
    }
  }

  parentPath(path: string) {
    if (path === "/") {
      return "";
    }
    return path.replace(/\/[^/]*?$/, "") || "/";
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

  fileToTree(files: File[]) {
    const map: { [key: string]: TreeNode } = {};
    for (let file of files) {
      delete (file as any).content;
      map[file.path] = {
        ...file,
        uri: "file://" + file.path,
      };

      let parent = this.parentPath(file.path);
      while (parent) {
        if (!map[parent]) {
          map[parent] = {
            type: "directory",
            uri: "file://" + parent,
            children: [],
          };
        }
        parent = this.parentPath(parent);
      }
    }
    Object.values(map).forEach((node) => {
      const path = node.uri.slice(7);
      const parent = this.parentPath(path);
      if (map[parent]) {
        if (!map[parent].children) {
          map[parent].children = [];
        }
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
