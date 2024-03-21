/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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