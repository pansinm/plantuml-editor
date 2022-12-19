import datasource from "..";

test("toTree", () => {
  const tree = datasource.fileToTree([
    {
      content: "",
      createdAt: 1,
      updatedAt: 2,
      path: "/",
      type: "directory",
    },
    {
      content: "",
      createdAt: 1,
      updatedAt: 2,
      path: "/test",
      type: "directory",
    },
  ]);
  expect(tree).toEqual({
    uri: "file:///",
    path: "/",
    type: "directory",
    createdAt: 1,
    updatedAt: 2,
    children: [
      {
        createdAt: 1,
        path: "/test",
        type: "directory",
        updatedAt: 2,
        uri: "file:///test",
      },
    ],
  });
});

test("parentPath", () => {
  expect(datasource.parentPath("/")).toBe("");
  expect(datasource.parentPath("/test")).toBe("/");
  expect(datasource.parentPath("/test/test")).toBe("/test");
});
