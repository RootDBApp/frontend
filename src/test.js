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

let categories_colors = [];
categories_colors['Category 1'] = 'rgb(255, 99, 132)';
categories_colors['Category 2'] = 'rgb(255, 159, 64)';
categories_colors['Category 3'] = 'rgb(255, 205, 86)';
categories_colors['Category 4'] = 'rgb(75, 192, 192)';
categories_colors['Category 5'] = 'rgb(54, 162, 235)';
categories_colors['Category 6'] = 'rgb(153, 102, 255)';
categories_colors['Category 7'] = 'rgb(201, 203, 207)';
categories_colors['Category 8'] = 'rgb(179,168,107)';
categories_colors['Category 9'] = 'rgb(177,130,84)';
categories_colors['Category 10'] = 'rgb(92,255,86)';

let all_categories = [];
let all_months = [];
for (const row of jsonResults) {
    if (!all_categories.find(category => category === row.category_name)) {
        all_categories.push(row.category_name);
    }
    if (!all_months.find(month => month === row.month)) {
        all_months.push(row.month);
    }
}

let datas = [];
for (const category_name of all_categories) {

    datas.push({
        label: category_name,
        borderColor: categories_colors[category_name],
        backgroundColor: categories_colors[category_name],
        fill: false,
        data: jsonResults?.reduce((a, row) => (row.category_name === category_name && a.push(row.number_of_orders), a), [])
    });
}

new Chart(refCanvas.current, {
    type: 'line',
    data: {
        labels: all_months,
        datasets: datas,
    },
    options: {
        itemclick: toogleDataSeries,
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
            display: true,
            text: 'Evolution of Categories\'s orders'
        },
        toolTip: {
            shared: true
        },
    }
});