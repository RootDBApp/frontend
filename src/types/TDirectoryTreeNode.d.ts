import TreeNode from "primereact/treenode";

type TDirectoryTreeNode = Omit<TreeNode, 'children'> & {
    children: TDirectoryTreeNode[],
    reportCount?: number,
    childrenReportCount?: number,
};

export = TDirectoryTreeNode;