const WIDTH = 1250
const HEIGHT = 750
const RADIUS = 100
const IMAGE_WIDTH = 30
const IMAGE_HEIGHT = 36

class LineChart {


    constructor(data, BC) {
        let key = 'Average_Line_ML';
        this.BC = BC;
        let teamData = d3.group(data, d => d.Team)
        let lineColorScale = d3.scaleOrdinal(d3.schemeDark2).domain(teamData.keys());
        let dates = data.map((row) => {
            return new Date(row.Date);
        });
        this.dateStart = d3.min(dates);
        this.dateEnd = d3.max(dates);

        this.originalStart = this.dateStart;
        this.originalEnd = this.dateEnd;

        this.originalData = data;
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
                d3.select('#flexSwitchCheckDefault2').property('checked', false);

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

        let teamFiltered = d3.filter(data, d => nameSet.has(d.Team));
        this.createLineChart(key, teamFiltered, lineColorScale);

        let checkSelection = d3.select('#switch1');
        let oldSet = new Set(nameSet);
        checkSelection.on('click', (d) => {
            //clear the selected team buttons
            d3.select('#flexSwitchCheckDefault2').property('checked', false);

            oldSet = new Set(nameSet);
            nameSet.clear();
            d3.select('#teamButtons')
                .selectAll('input')
                .attr('class', 'left');

            let checked = d3.select('#flexSwitchCheckDefault').property('checked');

            if (checked) {
                //get the recent date selection
                data = this.handleDateFiltering(key, data, lineColorScale);

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
                let maxed = [...teamMisprediction.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
                let mispredicted = d3.filter(data, d => d.Team === maxed[0])
                this.createLineChart(key, mispredicted, lineColorScale);
            } else {
                this.createLineChart(key, [], lineColorScale);
            }
        });

        //the most correctly predicted team
        let checkSelection2 = d3.select('#switch2');
        checkSelection2.on('click', d => {
            d3.select('#flexSwitchCheckDefault').property('checked', false);
            oldSet = new Set(nameSet);
            nameSet.clear();
            d3.select('#teamButtons')
                .selectAll('input')
                .attr('class', 'left');

            let checked = d3.select('#flexSwitchCheckDefault2').property('checked');
            if (checked) {
                //get the recent date selection
                data = this.handleDateFiltering(key, data, lineColorScale);
                //find the most correctly predicted team(s)
                let teamData = d3.group(data, d => d.Team);
                let teamCorrectPrediction = new Map();
                for (let teamGames of teamData) {
                    let numCorrectlyPredicted = 0;
                    for (let row of teamGames[1]) {
                        let prediction = parseFloat(row[key]);
                        if ((prediction < 0 && row.Result === 'W') ||
                            (prediction > 0 && row.Result === 'L')) {
                            numCorrectlyPredicted++;
                        }
                    }
                    teamCorrectPrediction.set(teamGames[0], numCorrectlyPredicted);
                }
                let maxed = [...teamCorrectPrediction.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
                let correctlyPredicted = d3.filter(data, d => d.Team === maxed[0])
                this.createLineChart(key, correctlyPredicted, lineColorScale);
            } else {
                this.createLineChart(key, [], lineColorScale);
            }
        });

    }

    /**
     * Uses the data passed in to filter output data based on the calendar date
     * @param {*} key 
     * @param {*} data use teams in data to filter even more
     * @param {*} lineColorScale 
     * @returns 
     */
    handleDateFiltering(key, data, lineColorScale) {
        //get the teams used by this data
        //this is hacky
        let teamNameSet = new Set();
        for (let row of data) {
            teamNameSet.add(row.Team);
        }
        data = d3.filter(this.originalData, d => teamNameSet.has(d.Team));

        let dates = data.map((row) => {
            return new Date(row.Date);
        });
        let outerContext = this;

        $(function () {
            $('input[name="daterange"]').daterangepicker({
                opens: 'left',
                startDate: outerContext.dateStart,
                endDate: outerContext.dateEnd,
                minDate: outerContext.originalStart,
                maxDate: outerContext.originalEnd
            }, function (start, end, label) {
                let filtered = d3.filter(data, d => {
                    let gameDate = new Date(d.Date);
                    return gameDate >= start && gameDate <= end;
                });

                //every time date selection happens need to update globally
                outerContext.dateStart = start;
                outerContext.dateEnd = end;
                outerContext.createLineChart(key, filtered, lineColorScale)
            });
        });

        return d3.filter(data, d => {
            let gameDate = new Date(d.Date);
            return gameDate >= this.dateStart && gameDate <= this.dateEnd;
        });
    }
    /**
     * Creates the line chart with some data
     * @param {*} key Column in data to be used (ex. 'Average_Line_ML')
     * @param {*} data 
     * @param {*} lineColorScale 
     */
    createLineChart(key, data, lineColorScale) {
        data = this.handleDateFiltering(key, data, lineColorScale);

        let padding = { left: 100, bottom: 140, right: 200 };

        const { xAxis, yAxis } = this.createAxes(data, padding, key);


        let teamData = d3.group(data, d => d.Team)
        this.createLines(teamData, lineColorScale, xAxis, key, yAxis);
        this.createDots(data, xAxis, key, yAxis);
        this.createBorder(data, key, xAxis, yAxis);
        this.voronoi(data, xAxis, key, yAxis);

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
     * @param {*} IMAGE_WIDTH 
     * @param {*} yAxis 
     * @param {*} IMAGE_HEIGHT 
     */
    createBorder(data, key, xAxis, yAxis) {
        let circleRadius = Math.sqrt(Math.pow(IMAGE_WIDTH/2, 2) + Math.pow(IMAGE_HEIGHT/2, 2)) - 2.5;
        d3.select('#border')
            .selectAll('circle')
            .data(data)
            .join('circle')
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
            .attr('cx', d => xAxis(new Date(d.Date)) /*- IMAGE_WIDTH / 2*/)
            .attr('cy', d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) /*- IMAGE_HEIGHT / 2*/;
            })
            .attr('r', circleRadius)
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
            .attr("transform", "rotate(-65)")
            .style('font-size', '18');


        //plot the average ML on Y-axis
        let odds = data.map((row) => parseFloat(row[key]));

        const yAxis = d3.scaleLinear()
            .domain([d3.max(odds), d3.min(odds)])
            .range([HEIGHT - padding.bottom, 10])
            .nice();
        d3.select('#y-axis')
            .attr('transform', `translate(${padding.left},0)`)
            .call(d3.axisLeft(yAxis))
            .style('font-size', '18');;


        // Append y axis text
        // d3
        //     .select('#line-chart')
        //     .append('text')
        //     .text('Average Money Line')
        //     .attr('x', -285)
        //     .attr('y', 20)
        //     .attr('transform', 'rotate(-90)')
        //     .style('font-size', '18');
        return { xAxis, yAxis };
    }

    /**
     * Uses d3-delaunay to find nearest data point, for tooltip displaying and line highlighting
     * 
     * Follows this tutorial: https://observablehq.com/@martgnz/distance-limited-interaction-with-d3-delaunay
     * @param {*} data 
     * @param {*} xAxis 
     * @param {*} IMAGE_WIDTH 
     * @param {*} key 
     * @param {*} yAxis 
     * @param {*} IMAGE_HEIGHT 
     */
    voronoi(data, xAxis, key, yAxis) {
        const delaunay = d3.Delaunay.from(
            data,
            d => xAxis(new Date(d.Date)) - IMAGE_WIDTH / 2,
            d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) - IMAGE_HEIGHT / 2;
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

        let outerContext = this;
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

            this.BC.drawchart(hover);
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
                    `${xAxis(new Date(hover.Date)) - IMAGE_WIDTH / 2}px`
                )
                .style('background', 'rgba(255,255,255,0.8)')
                .style('top', `${425 + yAxis(parseFloat(hover[key])) - IMAGE_HEIGHT / 2}px`)
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
     * @param {*} IMAGE_WIDTH 
     * @param {*} key 
     * @param {*} yAxis 
     * @param {*} IMAGE_HEIGHT 
     */
    createDots(data, xAxis, key, yAxis) {
        let outerContext = this;
        d3.select('#dots')
            .selectAll("image")
            .data(data)
            .join('image')
            .transition()
            .duration(2000)
            .attr('id', (d) => 'game' + d.GameId)
            .attr('x', d => xAxis(new Date(d.Date)) - IMAGE_WIDTH / 2)
            .attr('y', d => {
                let odds = parseFloat(d[key]);
                if (isNaN(odds)) {
                    return yAxis(0);
                }
                return yAxis(odds) - IMAGE_HEIGHT / 2;
            })
            .attr('width', IMAGE_WIDTH)
            .attr('height', IMAGE_HEIGHT)
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