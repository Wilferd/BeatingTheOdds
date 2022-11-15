const WIDTH = 1250
const HEIGHT = 2000
class LineChart {


    constructor(data) {
        let key = 'Average_Line_ML';
        // let teamData = d3.group(data, d => d.Team)

        this.setUp(key, data);
    }

    setUp(key, data) {
        let context = this;

        let teams = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit', 'Golden State', 'Houston', 'Indiana', 'L.A. Clippers', 'L.A. Lakers', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Sacramento', 'San Antonio', 'Toronto', 'Utah', 'Washington']
        //let nameSet = new Set(teams);
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
                this.createLineChart(key, filteredTeams)
            });


        this.createLineChart(key, d3.filter(data, d => nameSet.has(d.Team)));

    }

    createLineChart(key, data) {
        let padding = { left: 80, bottom: 140, right: 200 };

        let dates = data.map((row) => {
            return new Date(row.Date)
        });

        const xAxis = d3.scaleTime()
            .domain([d3.min(dates), d3.max(dates)])
            .range([padding.left, WIDTH - padding.right]);

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


        let teamData = d3.group(data, d => d.Team)
        let lineColorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(teamData.keys());
        d3.select('#lines')
            .selectAll('path')
            .data(teamData)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', ([group, values]) => lineColorScale(group))
            .attr('stroke-width', 1)
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
                })
                (values));

        const imageWidth = 20;
        const imageHeight = 24
        d3.select('#dots')
            .selectAll("image")
            .data(data)
            .join('image')
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
            .attr("xlink:href", d => `logos/${d.Team}.png`)

        d3.select('#border')
            .selectAll('rect')
            .data(data)
            .join('rect')
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

}