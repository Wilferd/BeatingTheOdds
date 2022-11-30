const WIDTH = 1250
const HEIGHT = 2000
const RADIUS = 100
class LineChart {


    constructor(data) {
        let key = 'Average_Line_ML';
        let teamData = d3.group(data, d => d.Team)
        let lineColorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(teamData.keys());
        this.setUp(key, data, lineColorScale);

    }

    /**
     * Creates the team buttons
     * @param {*} key 
     * @param {*} data 
     * @param {*} lineColorScale 
     */
    setUp(key, data, lineColorScale) {
        let context = this;

        let teams = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit', 'Golden State', 'Houston', 'Indiana', 'L.A. Clippers', 'L.A. Lakers', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Sacramento', 'San Antonio', 'Toronto', 'Utah', 'Washington']
        let nameSet = new Set(['Utah']);
        d3.select('#teamButtons')
            .selectAll('input')
            .data(teams)
            .join('input')
            .attr('id', d => {
                let idName = d.replace(' ', '0').replaceAll('.', '1');
                return idName
            })
            .attr('type', 'image')
            .attr('class', d => {
                if (d === 'Utah')
                    return 'right';
                return 'left';
            })
            .attr('value', '')
            .style('background-image', d => {
                return `url(logos/${d.replace(' ', '%20')}.png)`;
            })
            .on('click', (d) => {
                d3.select('#flexSwitchCheckDefault').property('checked', false);
                let selection = d3.select('#' + d.srcElement.id);
                let className = selection.attr('class');
                if (className === 'right') {
                    //unselect the team
                    nameSet.delete((d.srcElement.id).replaceAll('0', ' ').replaceAll('1', '.'));
                    selection.attr('class', 'left');
                } else {
                    nameSet.add((d.srcElement.id).replaceAll('0', ' ').replaceAll('1', '.'));
                    selection.attr('class', 'right');
                }

                let filteredTeams = d3.filter(data, d => nameSet.has(d.Team))
                this.createLineChart(key, filteredTeams, lineColorScale)
            });

        this.createLineChart(key, d3.filter(data, d => nameSet.has(d.Team)), lineColorScale);

        let checkSelection = d3.select('#switch1');
        let oldSet = new Set(nameSet);
        checkSelection.on('click', (d) => {
            //clear the selected team buttons
            oldSet = new Set(nameSet);
            nameSet.clear();
            d3.select('#teamButtons')
                .selectAll('input')
                .attr('class', 'left');


            let checked = d3.select('#flexSwitchCheckDefault').property('checked');

            if (checked) {
                //find the most mispredicted team(s)
                let teamData = d3.group(data, d => d.Team);
                let teamMisprediction = new Map();
                for (let teamGames of teamData) {
                    let numMispredicted = 0;
                    for (let row of teamGames[1]) {
                        let prediction = parseFloat(row[key]);
                        if ((prediction > 0 && row.Result === 'W') ||
                            (prediction < 0 && row.Result === 'L')) {
                            numMispredicted++;
                        }
                    }
                    teamMisprediction.set(teamGames[0], numMispredicted);
                }
                let maxed = [...teamMisprediction.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);
                let mispredicted = d3.filter(data, d => d.Team === maxed[0])
                this.createLineChart(key, mispredicted, lineColorScale);
            } else{
                this.createLineChart(key, [], lineColorScale);
            }


        });

    }

    /**
     * Creates the line chart with some data
     * @param {*} key Column in data to be used (ex. 'Average_Line_ML')
     * @param {*} data 
     * @param {*} lineColorScale 
     */
    createLineChart(key, data, lineColorScale) {
        let padding = { left: 80, bottom: 140, right: 200 };

        const { xAxis, yAxis } = this.createAxes(data, padding, key);


        let teamData = d3.group(data, d => d.Team)
        this.createLines(teamData, lineColorScale, xAxis, key, yAxis);

        const imageWidth = 20;
        const imageHeight = 24;
        this.createDots(data, xAxis, imageWidth, key, yAxis, imageHeight);
        this.createBorder(data, key, xAxis, imageWidth, yAxis, imageHeight);
        this.voronoi(data, xAxis, imageWidth, key, yAxis, imageHeight);

    }

    /**
     * Creates the lines for the line chart
     * @param {*} teamData 
     * @param {*} lineColorScale 
     * @param {*} xAxis 
     * @param {*} key 
     * @param {*} yAxis 
     */
    createLines(teamData, lineColorScale, xAxis, key, yAxis) {
        d3.select('#lines')
            .selectAll('path')
            .data(teamData)
            .join('path')
            .transition()
            .duration(1000)
            .attr('fill', 'none')
            .attr('stroke', ([group, values]) => lineColorScale(group))
            .attr('stroke-width', 1)
            .attr('id', d => 'line' + this.sanitizeTeamName(d[0]))
            .attr('d', ([group, values]) => d3.line()
                .x((d) => {
                    return xAxis(new Date(d.Date));
                })
                .y((d) => {
                    let odds = parseFloat(d[key]);
                    if (isNaN(odds)) {
                        return yAxis(0);
                    }
                    return yAxis(odds);
                })(values));
    }

    /**
     * Creates the border surrounding each dot
     * Green for correct prediction
     * Red for incorrect prediction
     * @param {*} data 
     * @param {*} key 
     * @param {*} xAxis 
     * @param {*} imageWidth 
     * @param {*} yAxis 
     * @param {*} imageHeight 
     */
    createBorder(data, key, xAxis, imageWidth, yAxis, imageHeight) {
        d3.select('#border')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .transition()
            .duration(2000)
            .attr('class', d => {
                let prediction = parseFloat(d[key]);
                if (prediction < 0 && d.Result === 'W') {
                    return 'image-border-correct';
                }
                else if (prediction > 0 && d.Result === 'L') {
                    return 'image-border-correct';
                }

                return 'image-border-wrong';

            })
            .attr('x', d => xAxis(new Date(d.Date)) - imageWidth / 2)
            .attr('y', d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) - imageHeight / 2;
            })
            .attr('width', imageWidth)
            .attr('height', imageHeight);
    }

    /**
     * Makes the x and y axes
     * @param {*} data 
     * @param {*} padding 
     * @param {*} key 
     * @returns the scales used for both axes
     */
    createAxes(data, padding, key) {
        let dates = data.map((row) => {
            return new Date(row.Date);
        });

        const xAxis = d3.scaleTime()
            .domain([d3.min(dates), d3.max(dates)])
            .range([padding.left, WIDTH - padding.right])
            .nice();

        d3
            .select('#x-axis')
            .attr('transform', `translate(0, ${HEIGHT - padding.bottom})`)
            .call(d3.axisBottom(xAxis).ticks(20).tickFormat(d3.timeFormat('%b %Y')))
            .selectAll('text')
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Append x axis text
        d3
            .select('#line-chart')
            .append('text')
            .text('Date')
            .attr('transform', `translate( ${375 + padding.left}, ${HEIGHT - padding.bottom + 70})`);


        //plot the average ML on Y-axis
        let odds = data.map((row) => parseFloat(row[key]));

        const yAxis = d3.scaleLinear()
            .domain([d3.max(odds), d3.min(odds)])
            .range([HEIGHT - padding.bottom, 10])
            .nice();
        d3.select('#y-axis')
            .attr('transform', `translate(${padding.left},0)`)
            .call(d3.axisLeft(yAxis));


        // Append y axis text
        d3
            .select('#line-chart')
            .append('text')
            .text('Average Money Line')
            .attr('x', -285)
            .attr('y', 20)
            .attr('transform', 'rotate(-90)');
        return { xAxis, yAxis };
    }

    /**
     * Uses d3-delaunay to find nearest data point, for tooltip displaying and line highlighting
     * 
     * Follows this tutorial: https://observablehq.com/@martgnz/distance-limited-interaction-with-d3-delaunay
     * @param {*} data 
     * @param {*} xAxis 
     * @param {*} imageWidth 
     * @param {*} key 
     * @param {*} yAxis 
     * @param {*} imageHeight 
     */
    voronoi(data, xAxis, imageWidth, key, yAxis, imageHeight) {
        const delaunay = d3.Delaunay.from(
            data,
            d => xAxis(new Date(d.Date)) - imageWidth / 2,
            d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) - imageHeight / 2;
            });


        let tooltip = d3
            .select('#content')
            .append('div')
            .style('width', '200px')
            .style('position', 'absolute')
            .style('padding', '8px')
            .style('border', '1px solid #ccc')
            .style('pointer-events', 'none')
            .style('background', 'white')
            .style('display', 'none');


        const mouseleft = () => {
            tooltip.style('display', 'none');
            d3.select('#dots')
                .selectAll('image')
                .style('filter', "none");

            d3.select('#lines')
                .selectAll('path')
                .attr('stroke-width', 1)
                .attr('display', 'default')
        };

        const mousemoved = (e) => {
            let [mx, my] = d3.pointer(e);
            find = (mx, my) => {
                const idx = delaunay.find(mx, my);

                if (idx !== null) {
                    return data[idx];
                }

                return null;
            };

            let hover = find(mx, my);

            if (!hover)
                return mouseleft();

            let prediction = parseFloat(hover[key]);
            let color = "red";
            let predictionText = 'Incorrect';
            if ((prediction < 0 && hover.Result === 'W')
                || (prediction > 0 && hover.Result === 'L')) {
                color = 'green';
                predictionText = 'Correct';
            }
            tooltip
                .style('display', 'block')
                .style('position', 'absolute')
                .style(
                    'left',
                    `${xAxis(new Date(hover.Date)) - imageWidth / 2}px`
                )
                .style('background', 'rgba(255,255,255,0.8)')
                .style('top', `${250 + yAxis(parseFloat(hover[key])) - imageHeight / 2}px`)
                .html(`<div>
                 <strong>Team</strong>: ${hover.Team} <br>
                 <strong>Opponent</strong>: ${hover.OppTeam} <br>
                 <strong>Date</strong>: ${(new Date(hover.Date)).toLocaleDateString()} <br>
                 Avg Money Line: ${hover[key]}
                <p style="color:${color}">${predictionText} Prediction</p>
                 </div>`);


            //blur all of the other teams
            d3.select('#dots')
                .selectAll('image')
                .style('filter', d => d.Team !== hover.Team ? 'grayscale(0.5) blur(1px)' : "none");


            //emphasize the line
            d3.select('#lines')
                .select('#line' + this.sanitizeTeamName(hover.Team))
                .attr('stroke-width', 3)

            d3.select('#lines')
                .selectAll('path')
                .attr('display', d => {
                    return (this.sanitizeTeamName(d[0]) === this.sanitizeTeamName(hover.Team) ?
                        'default' : 'none')
                })
        };

        d3.select('#line-chart')
            .select('#voronoi')
            .selectAll('rect')
            .data([0])
            .join('rect')
            .attr('fill', 'transparent')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .on('mousemove', mousemoved)
            .on('mouseleave', mouseleft);
    }

    /**
     * Creates line chart dots corresponding to each team in the data
     * @param {*} data 
     * @param {*} xAxis 
     * @param {*} imageWidth 
     * @param {*} key 
     * @param {*} yAxis 
     * @param {*} imageHeight 
     */
    createDots(data, xAxis, imageWidth, key, yAxis, imageHeight) {
        d3.select('#dots')
            .selectAll("image")
            .data(data)
            .join('image')
            .transition()
            .duration(2000)
            .attr('id', (d) => 'game' + d.GameId)
            .attr('x', d => xAxis(new Date(d.Date)) - imageWidth / 2)
            .attr('y', d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) - imageHeight / 2;
            })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr("xlink:href", d => `logos/${d.Team}.png`);
    }

    /**
     * Makes the team name palatable for an html class
     * @param {*} name team name to make palatable
     * @returns 
     */
    sanitizeTeamName(name) {
        return name.replace(' ', '0').replaceAll('.', '1');
    }

    /**
     * Takes a santized name and converts back
     * @param {*} name 
     * @returns 
     */
    unsantizeTeamName(name) {
        return name.replaceAll('0', ' ').replaceAll('1', '.');
    }


}