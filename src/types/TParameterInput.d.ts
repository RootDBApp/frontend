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

import TParameterInputType     from "./TParameterInputType";
import TParameterInputDataType from "./TParameterInputDataType";
import TConnector              from "./TConnector";

type TParameterInput = {
    conf_connector_id: number,
    custom_entry: number,
    default_value: string,
    id: number,
    name: string,
    parameter_input_type_id: number,
    parameter_input_data_type_id: number,
    query: string,
    query_default_value: string,
    conf_connector?: TConnector,
    parameter_input_type?: TParameterInputType,
    parameter_input_data_type?: TParameterInputDataType,
    values?: any,
};
export = TParameterInput;