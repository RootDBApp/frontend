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

import { Button }                                                               from "primereact/button";
import { Card }                                                                 from "primereact/card";
import * as React                                                               from 'react';
import { useTranslation }                                                       from "react-i18next";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DropResult } from "react-beautiful-dnd";


import { ICallbackInfoJsonFormOnChange } from "../../../../types/ICallBacks";
import TCallbackResponse                 from "../../../../types/TCallbackResponse";
import env                               from "../../../../envVariables";
import { Tooltip }                       from "primereact/tooltip";
import TDataViewMetricRow                from "../../../../types/TDataViewMetricRow";
import TDataViewMetricForm               from "../../../../types/TDataViewMetricForm";
import DataViewMetricGlobalForm          from "./DataViewMetricGlobalForm";
import DataViewMetricColumnParameterForm from "./DataViewMetricColumnParameterForm";
import TSQLResultColumn                  from "../../../../types/TSQLResultColumn";
import TReportParameter                  from "../../../../types/TReportParameter";
import { generateUniqueIdInsideView }    from "../../../../utils/dataView";
import { Accordion }                     from "primereact/accordion";

const DataViewMetricParamsForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    config?: TDataViewMetricForm,
    onChangeCallback: ICallbackInfoJsonFormOnChange,
    columns?: TSQLResultColumn[],
    reportParameters?: TReportParameter[],
    className?: string,
}> = ({
          callBackResponse,
          config,
          onChangeCallback,
          className,
          reportParameters,
          columns
      }): React.ReactElement => {

    const {t} = useTranslation(['report']);

    const [subTabColumnIndexActivated, setSubTabColumnIndexActivated] = React.useState<number>(-1);

    const {rows = [], global = {}} = React.useMemo(() => {
        const {rows, global} = config || {};
        return {rows, global};
    }, [config]);


    const handleOnCreateRow = () => {

        console.log('handleOnCreateRow')
        const newForm = [...rows, {id: generateUniqueIdInsideView(20, rows?.map(r => r.id))}];
        onChangeCallback({rows: newForm, global: global});
    }

    const handleOnDeleteRow = (row: TDataViewMetricRow) => {

        console.log('handleOnDeleteRow')
        const newForm = rows?.filter(r => r.id !== row.id);
        onChangeCallback({rows: newForm, global: global});
    }

    const handleOnChangeRow = (row: TDataViewMetricRow) => {

        console.log('handleOnChangeRow')
        const columnIndex = rows?.findIndex(r => r.id === row.id);
        const newForm = [...rows];
        newForm[columnIndex] = row;
        onChangeCallback({rows: newForm, global: global});
    }

    const handleOnChangeGlobalForm = (globalForm: TDataViewMetricForm['global']) => {

        console.log('handleOnChangeGlobalForm')
        onChangeCallback({rows: rows, global: globalForm});
    }

    const reOrderColumns = (index: number, destination: number) => {
        console.log('reorderColumns')
        const newColumns = [...rows];
        const [removed] = newColumns.splice(index, 1);
        newColumns.splice(destination, 0, removed);

        onChangeCallback(
            {
                rows: newColumns,
                global: global,
            }
        )
    }

    const onDragEnd = (result: DropResult): void => {
        console.log('onDragEnd')

        // If dropped outside the list.
        if (!result.destination) {
            return;
        }

        reOrderColumns(result.source.index, result.destination.index);
    }

    const activeSubTabColumnIndex = (index: number): void => {

        if (index !== subTabColumnIndexActivated) {
            setSubTabColumnIndexActivated(index);
        } else if (index === subTabColumnIndexActivated) {
            setSubTabColumnIndexActivated(-1);
        }
    }

    const subTabColumnTabCssClassname = React.useCallback((tabIndex: number): string => {

        return tabIndex === subTabColumnIndexActivated ? 'p-accordion-tab p-accordion-tab-active' : 'p-accordion-tab';
    }, [subTabColumnIndexActivated]);

    const subTabColumnTabPiToggleAngle = React.useCallback((tabIndex: number): string => {

        return tabIndex === subTabColumnIndexActivated ? 'down' : 'right';
    }, [subTabColumnIndexActivated]);

    const subTabColumnTabHeaderCssClassname = React.useCallback((tabIndex: number): string => {

        return tabIndex === subTabColumnIndexActivated ? 'p-accordion-header p-highlight' : 'p-accordion-header';
    }, [subTabColumnIndexActivated]);

    return (
        <div className={className}>
            <Card
                title={t('report:dataview.info_view_form.title').toString()}
                style={{flexGrow: 1}}
            >

                <DataViewMetricGlobalForm
                    globalForm={global}
                    onChangeCallback={handleOnChangeGlobalForm}
                />

                <Tooltip
                    target={`.tooltip-drag-n-drop`}
                    showDelay={env.tooltipShowDelay}
                    hideDelay={env.tooltipHideDelay}
                />
                <Tooltip
                    target={`.tooltip-column-removed`}
                    showDelay={env.tooltipShowDelay}
                    hideDelay={env.tooltipHideDelay}
                />
                <Tooltip
                    target={`.tooltip-new-column-detected`}
                    showDelay={env.tooltipShowDelay}
                    hideDelay={env.tooltipHideDelay}
                />

                <Button
                    className="my-3"
                    type="button"
                    icon="pi pi-plus"
                    label={t('report:dataview.info_view_form.add_row').toString()}
                    onClick={() => handleOnCreateRow()}
                />

                {/*I'm here only to load inline styles*/}
                <Accordion style={{ display: "none" }} />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="vertical">
                        {(provided) => (

                            <div className="p-accordion p-component" ref={provided.innerRef} {...provided.droppableProps}>
                                {rows?.map((columnParameter: TDataViewMetricRow, index: number) => (

                                    <Draggable key={`td_${index}`} draggableId={`td_${index}`} index={index}>
                                        {(provided: DraggableProvided) => (

                                            <div className={subTabColumnTabCssClassname(index)}
                                                 ref={provided?.innerRef}
                                                 style={{cursor: 'pointer'}}
                                                 {...provided?.draggableProps}
                                                 {...provided?.dragHandleProps}
                                            >
                                                <div className={subTabColumnTabHeaderCssClassname(index)}>

                                                    <div id={`pr_id_${index}_header_0`} className="p-accordion-header-link">

                                                        <i className={`p-accordion-toggle-icon pi pi-angle-${subTabColumnTabPiToggleAngle(index)}`} onClick={() => activeSubTabColumnIndex(index)}/>

                                                        <div className="flex-grow-1 flex align-items-center justify-content-between" onClick={() => activeSubTabColumnIndex(index)}>

                                                            <span>{columnParameter.text?.substring(0, 20) || columnParameter.id}</span>

                                                            <div>
                                                                <i className="tooltip-drag-n-drop p-button-icon-only p-button-icon-small p-button-sm p-button-text pi pi-bars icon-draggable"
                                                                   data-pr-tooltip={t('report:dataview.table_form.you_can_drag_n_drop_column').toString()}
                                                                   data-pr-position="bottom"
                                                                />
                                                                <Button
                                                                    className={`p-button-icon-only p-button-icon-small p-button-sm p-button-text ${index === 0 ? 'pointer-events-auto' : ''}`}
                                                                    icon="pi pi-arrow-up"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        reOrderColumns(index, index - 1);
                                                                    }}
                                                                    disabled={index === 0}
                                                                    tooltip={t('report:dataview.table_form.move_column_left').toString()}
                                                                    tooltipOptions={{position: 'left', showDelay: env.tooltipShowDelay, hideDelay: env.tooltipHideDelay}}
                                                                />
                                                                <Button
                                                                    className={`p-button-icon-only p-button-icon-small p-button-sm p-button-text ${index === rows?.length - 1 ? 'pointer-events-auto' : ''}`}
                                                                    icon="pi pi-arrow-down"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        reOrderColumns(index, index + 1);
                                                                    }}
                                                                    disabled={index === rows?.length - 1}
                                                                    tooltip={t('report:dataview.table_form.move_column_right').toString()}
                                                                    tooltipOptions={{position: 'left', showDelay: env.tooltipShowDelay, hideDelay: env.tooltipHideDelay}}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                {subTabColumnIndexActivated === index &&
                                                    <div id={`stc_${index}`} className="p-toggleable-content p-toggleable-content-enter-done">
                                                        <div className="p-accordion-content">
                                                            <DataViewMetricColumnParameterForm
                                                                rows={rows}
                                                                currentRow={rows[index]}
                                                                onChangeCallback={handleOnChangeRow}
                                                                onDeleteCallback={handleOnDeleteRow}
                                                                callBackResponse={callBackResponse}
                                                                columns={columns}
                                                                reportParameters={reportParameters}
                                                            />
                                                        </div>
                                                    </div>
                                                }

                                            </div>

                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Card>
        </div>
    )
}

export default DataViewMetricParamsForm;
