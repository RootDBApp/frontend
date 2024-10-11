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

import * as React from 'react';

import DirectoriesListing from "./DirectoriesListing";
import InputDateSelector  from "../common/form/InputDateSelector";

const Home: React.FC = (): React.ReactElement => {
    const [date, setDate] = React.useState(new Date().toString());
    return (
        <>
            <InputDateSelector
                value={date}
                options={[
                    {id: "-2", label: "-2", value: "2024-10-09"},
                    {id: "-1", label: "-1", value: "2024-10-10"},
                    {id: "now", label: "now", value: "2024-10-11"},
                    {id: "+1", label: "+1", value: "2024-10-12"},
                    {id: "+2", label: "+2", value: "2024-10-13"},
                    {id: "+3", label: "+3", value: "2024-10-14", subMenu: true},
                    {id: "+4", label: "+4", value: "2024-10-15", subMenu: true},
                    {id: "+5", label: "+5", value: "2024-10-16", subMenu: true},
                ]}
                setValueCallBack={setDate}
            />
            <div id="home" className="expand-vertically"><DirectoriesListing/></div>
        </>
    )
}

export default Home;
