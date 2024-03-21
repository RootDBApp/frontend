import { DropdownProps }  from "primereact/dropdown";
import { TreeSelect }     from "primereact/treeselect";
import TreeNode           from "primereact/treenode";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import apiDataContext             from "../../../contexts/api_data/store/context";
import { FAVORITES_DIRECTORY_ID } from "../../../utils/definitions";
import TDirectoryTreeNode         from "../../../types/TDirectoryTreeNode";

const TreeSelectDirectory: React.FC<{
    id: string,
    isInvalid: boolean,
    directories?: TDirectoryTreeNode[],
    disableDirectoryIds?: Array<number>,
} & DropdownProps> = (
    {
        id,
        isInvalid,
        directories,
        disableDirectoryIds,
        ...props
    }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState} = React.useContext(apiDataContext);

    const setSelectableDirectory = (treeNodes: TreeNode.TreeNode[]): TreeNode.TreeNode[] => treeNodes.map(
        (treeNode: TreeNode.TreeNode) => ({
            ...treeNode,
            selectable: !disableDirectoryIds?.includes(Number(treeNode.key)),
            children: treeNode.children && treeNode.children.length > 0
                ? setSelectableDirectory(treeNode.children)
                : undefined,
        })
    )

    return (
        // @ts-ignore - react-18 move
        <TreeSelect
            {...props}
            emptyMessage=''
            name={id}
            options={
                setSelectableDirectory(directories || apiDataState.directoriesTree || [])
                    .filter((treeNode: TreeNode.TreeNode) => Number(treeNode.key) !== FAVORITES_DIRECTORY_ID)
            }
            placeholder={t('report:form.choose_directory').toString()}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
        />
    )
};

export default TreeSelectDirectory;