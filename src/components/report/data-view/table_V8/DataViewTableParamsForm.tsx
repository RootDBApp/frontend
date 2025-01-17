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
import { TabPanel, TabView }                                                    from "primereact/tabview";
import * as React                                                               from 'react';
import { useTranslation }                                                       from "react-i18next";
import { DragDropContext, Draggable, DraggableProvided, Droppable, DropResult } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";


import { ICallbackTableJsonFormOnChange }  from "../../../../types/ICallBacks";
import TDataViewTableColumnParameter       from "../../../../types/TDataViewTableColumnParameter";
import { filterJsonColumnsFormBeforeSave } from '../../../../utils/tableView';
import DataViewTableColumnParameterForm    from "./DataViewTableColumnParameterForm";
import DataViewTableGlobalForm             from "./DataViewTableGlobalForm";
import TDataViewTableForm                  from "../../../../types/TDataViewTableForm";
import TCallbackResponse                   from "../../../../types/TCallbackResponse";
import env                                 from "../../../../envVariables";
import { Tooltip }                         from "primereact/tooltip";
import { Accordion }                       from "primereact/accordion";

const DataViewTableParamsForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    columnParameters: Array<TDataViewTableColumnParameter>,
    globalForm: TDataViewTableForm['global'],
    onChangeCallback: ICallbackTableJsonFormOnChange,
    className?: string,
    resetColumns: Function,
}> = ({
          callBackResponse,
          columnParameters,
          globalForm,
          onChangeCallback,
          className,
          resetColumns,
      }): React.ReactElement => {

    const {t} = useTranslation(['report']);

    const [activeMainTabIndex, setActiveMainTabIndex] = React.useState<number>(0);
    const [subTabColumnIndexActivated, setSubTabColumnIndexActivated] = React.useState<number>(-1);

    const handleOnCreateColumn = (column: TDataViewTableColumnParameter) => {

        const newForm = [...filterJsonColumnsFormBeforeSave(columnParameters), {...column, new: false}];
        onChangeCallback({columns: newForm, global: globalForm});
    }

    const handleOnDeleteColumn = (column: TDataViewTableColumnParameter) => {

        const newForm = filterJsonColumnsFormBeforeSave(columnParameters.filter(c => c.column !== column.column));
        onChangeCallback({columns: newForm, global: globalForm});
    }

    const handleOnChangeColumn = (column: TDataViewTableColumnParameter) => {

        const columnIndex = filterJsonColumnsFormBeforeSave(columnParameters).findIndex(c => c.column === column.column);
        const newForm = [...filterJsonColumnsFormBeforeSave(columnParameters)];
        newForm[columnIndex] = column;
        onChangeCallback({columns: newForm, global: globalForm});
    }

    const handleOnChangeGlobalForm = (globalForm: TDataViewTableForm['global']) => {

        onChangeCallback({columns: columnParameters, global: globalForm});
    }

    const reOrderColumns = (index: number, destination: number) => {

        const newColumnParameters = Array.from(columnParameters);
        const [removed] = newColumnParameters.splice(index, 1);
        newColumnParameters.splice(destination, 0, removed);

        onChangeCallback(
            {
                columns: newColumnParameters,
                global: globalForm,
            }
        )
    }

    const onDragEnd = (result: DropResult): void => {

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
                title={t('report:dataview.table_form.title').toString()}
                style={{flexGrow: 1}}
                subTitle={t('report:dataview.table_form.subtitle').toString()}
            >
                <TabView activeIndex={activeMainTabIndex} onTabChange={(e) => setActiveMainTabIndex(e.index)}>

                    {/*Table form*/}
                    <TabPanel header={t('report:dataview.table_form.global_config')}>
                        <DataViewTableGlobalForm
                            callBackResponse={callBackResponse}
                            globalForm={globalForm}
                            onChangeCallback={handleOnChangeGlobalForm}
                        />
                    </TabPanel>

                    {/*Columns forms*/}
                    <TabPanel header={t('report:dataview.table_form.column_config')}>
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
                            type="button"
                            label={t('report:dataview.table_form.reset_from_results').toString()}
                            icon="pi pi-replay"
                            className="p-button-sm p-button-outlined mb-2"
                            tooltip={t('report:dataview.table_form.reset_from_results_tooltip').toString()}
                            tooltipOptions={{position: 'left', showDelay: env.tooltipShowDelay, hideDelay: env.tooltipHideDelay}}
                            onClick={() => resetColumns(columnParameters)}
                        />

                        {/*I'm here only to load inline styles*/}
                        <Accordion style={{display: "none"}}/>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable" direction="vertical">
                                {(provided) => (

                                    <div className="p-accordion p-component" ref={provided.innerRef} {...provided.droppableProps}>
                                        {columnParameters.map((columnParameter: TDataViewTableColumnParameter, index) => (

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

                                                                    <span>
                                                                        {columnParameter.new === true && <i className="tooltip-new-column-detected pi pi-plus-circle mr-2" data-pr-tooltip={t('report:dataview.table_form.new_column_detected').toString()} data-pr-position="left"/>}
                                                                        {columnParameter.removed === true && <i className="tooltip-column-removed pi pi-trash mr-2" data-pr-tooltip={t('report:dataview.table_form.colunn_removed').toString()} data-pr-position="left"/>}
                                                                        {columnParameter.header}
                                                                        {String(columnParameter.header) !== String(columnParameter.column) ? <i className="font-normal text-color-secondary opacity-60">&nbsp;{columnParameter.column}</i> : <></>}
                                                                    </span>

                                                                    <div>
                                                                        <i className="tooltip-drag-n-drop p-button-icon-only p-button-icon-small p-button-sm p-button-text pi pi-bars icon-draggable"
                                                                           data-pr-tooltip={t('report:dataview.table_form.you_can_drag_n_drop_column').toString()}
                                                                           data-pr-position="bottom"
                                                                        />
                                                                        <Button
                                                                            className="p-button-icon-only p-button-icon-small p-button-sm p-button-text"
                                                                            icon={columnParameter.hidden ? "pi pi-eye-slash" : 'pi pi-eye'}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleOnChangeColumn({
                                                                                    ...columnParameter,
                                                                                    hidden: !columnParameter.hidden
                                                                                })
                                                                            }}
                                                                            tooltip={columnParameter.hidden
                                                                                ? t('report:dataview.table_form.shown').toString()
                                                                                : t('report:dataview.table_form.hidden').toString()
                                                                            }
                                                                            tooltipOptions={{position: 'left', showDelay: env.tooltipShowDelay, hideDelay: env.tooltipHideDelay}}
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
                                                                            className={`p-button-icon-only p-button-icon-small p-button-sm p-button-text ${index === columnParameters.length - 1 ? 'pointer-events-auto' : ''}`}
                                                                            icon="pi pi-arrow-down"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                reOrderColumns(index, index + 1);
                                                                            }}
                                                                            disabled={index === columnParameters.length - 1}
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
                                                                    <DataViewTableColumnParameterForm
                                                                        callBackResponse={callBackResponse}
                                                                        columnParameters={columnParameters}
                                                                        currentColumnParameter={columnParameter}
                                                                        isNewParameter={columnParameter.new}
                                                                        onChangeCallback={handleOnChangeColumn}
                                                                        onCreateCallback={handleOnCreateColumn}
                                                                        onDeleteCallback={handleOnDeleteColumn}
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
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    )
}

export default DataViewTableParamsForm;
