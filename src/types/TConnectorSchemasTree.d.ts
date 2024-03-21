import IRootDBTreeNode from "./IRootDBTreeNode";

type TConnectorSchemasTree = {
    connector_id: number,
    schema_trees: Array<IRootDBTreeNode>
}

export = TConnectorSchemasTree;