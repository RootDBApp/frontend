import { Tooltip }        from "primereact/tooltip";
import { Tree }           from "primereact/tree";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import apiDataContext                 from "../../contexts/api_data/store/context";
import { getConnectorSchemaTrees }    from "../../contexts/api_data/store/actions";
import TConnectorSchemasTree          from "../../types/TConnectorSchemasTree";
import { EPrimeReactTreeDBLabelType } from "../../types/primereact/EPrimeReactTreeDB";
import env                            from "../../envVariables";

const SchemaTree: React.FC<{
    connectorId: number,
    cssClassName?: string,
    loadingStatusCallback?: CallableFunction,
    seeTableDataHandler: Function,
}> = ({
          connectorId,
          cssClassName,
          loadingStatusCallback,
          seeTableDataHandler
      }): React.ReactElement => {

    const {t} = useTranslation();
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext)
    const [currentConnectorId, setCurrentConnectorId] = React.useState(connectorId);
    const [loading, setLoading] = React.useState(true);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    // Using a custom TreeNode.
    const nodeTemplate = (node: any, options: any) => {

        let label: string | undefined | React.ReactElement = node.label;
        const {props: {parent: {label: parentLabel = '', key = ''} = {}} = {}} = options;
        let parent = parentLabel;

        // special view : get the parent name from key : [database]-views
        if (node.label_type === EPrimeReactTreeDBLabelType.VIEW) {
            const endOfName = key.lastIndexOf('-views');
            parent = key.substring(0, endOfName);
        }

        if (node.label_type === EPrimeReactTreeDBLabelType.TABLE_SCHEMA) {

            label = <b>{node.label}</b>;
        } else if (node.data) {
            label = (
                <>
                    {node.data_description && (
                        <Tooltip
                            style={{maxWidth: "500px"}}
                            target={`#${node.key}`}
                            content={node.data_description}
                            mouseTrack
                            mouseTrackTop={35}
                            className="no-arrow"
                            showDelay={env.tooltipShowDelay}
                            hideDelay={env.tooltipHideDelay}
                        />
                    )}
                    <span id={`${node.key}`}>
                        {node.label}
                        <span className="column-def ml-2">{node.data}</span>
                    </span>
                </>
            );
        }

        return (
            <>
                {[EPrimeReactTreeDBLabelType.TABLE, EPrimeReactTreeDBLabelType.VIEW].includes(node.label_type) && (
                    <>
                        <Tooltip
                            style={{maxWidth: "500px"}}
                            target={`#${parent}-${node.label}`}
                            content={t('common:treedb.table_preview').toString()}
                            showDelay={env.tooltipShowDelay}
                            hideDelay={env.tooltipHideDelay}
                        />
                        <span
                            id={`${parent}-${node.label}`}
                            className="p-treenode-icon pi pi-fw pi-play cursor-pointer"
                            onDoubleClick={() => seeTableDataHandler(`
                                SELECT 'SELECT * FROM \`${parent}\`.\`${node.label}\` LIMIT 500' as query;
                                SELECT *
                                FROM \`${parent}\`.\`${node.label}\` LIMIT 500;
                            `)}
                        />
                    </>
                )}
                <span className={options.className}>{label}</span>
            </>
        )
    }

    // Handle refresh of tree.
    React.useEffect(() => {

        if (connectorId > 0) {

            const connectorSchemasTreeFound = apiDataState.connectorSchemasTree.find(
                (connectorSchemasTree: TConnectorSchemasTree) => {
                    return connectorSchemasTree.connector_id === connectorId
                });

            if ((
                    (connectorId !== currentConnectorId && !connectorSchemasTreeFound)
                    ||
                    (connectorSchemasTreeFound?.schema_trees?.length === 0 && !apiDataState.connectorSchemasTreeLoading)
                    ||
                    !connectorSchemasTreeFound
                )
                && tryCounter < 1
            ) {

                if (loadingStatusCallback) {

                    loadingStatusCallback(true);
                }
                setLoading(true);
                setTryCounter(1);
                setCurrentConnectorId(connectorId);
                apiDataDispatch(getConnectorSchemaTrees(connectorId));
            } else if (connectorSchemasTreeFound) {

                // Because we dispatch a default 'no-data' TConnectorSchemasTree.
                if (connectorSchemasTreeFound.schema_trees[0].label !== 'no data') {

                    setTryCounter(0);
                    setLoading(false);
                    if (loadingStatusCallback) {

                        loadingStatusCallback(false);
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiDataState.connectorSchemasTree,
        apiDataState.connectorSchemasTreeLoading,
        apiDataDispatch,
        connectorId,
        currentConnectorId,
        tryCounter,
    ]);

    return (
        <>
            <Tree
                value={apiDataState.connectorSchemasTree.find(
                    (connectorSchemasTree: TConnectorSchemasTree) => {
                        return connectorSchemasTree.connector_id === connectorId
                    })?.schema_trees}
                filter
                className={cssClassName}
                nodeTemplate={nodeTemplate}
                loading={loading}
            />
        </>
    );
}
export default SchemaTree;