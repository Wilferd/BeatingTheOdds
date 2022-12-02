class BarChart {
    constructor(loadedData) {
        this.loadedData = loadedData;
        this.margin = { left: 60, right: 50, top: 25, bottom: 25 }

        this.currHome = this.loadedData[1]
        this.currAway = this.loadedData[0] 

        console.log(d3.select("#flexRadioDefault2").property("checked"))

        this.drawchart(this.loadedData[1])

        d3.select("#flexRadioDefault1").on('click', (d) => {
            console.log("click")
            if (d3.select("#flexRadioDefault1").property("checked")) {
                this.drawchartMoney(this.currHome, this.currAway)
            }
            else {
                this.drawchartSpread(this.currHome, this.currAway)
            }
        });

        d3.select("#flexRadioDefault2").on('click', (d) => {
            console.log("click2")
            if (d3.select("#flexRadioDefault2").property("checked")) {
                this.drawchartSpread(this.currHome, this.currAway)
            }
            else {
                this.drawchartMoney(this.currHome, this.currAway)
            }
        });

        

    }

    drawchart(game) {
        //console.log(d3.select("#flexRadioDefault2").property("checked"))
        let data = d3.filter(this.loadedData, d => d.GameId === game.GameId)

        var other = data[0]

        if (game.Location === data[0].Location) {
            other = data[1]
        }

        let home = data[0]
        let away = data[1]

        if (game["Average_Line_Spread"] < 0) {
            home = game;
            away = other
        }
        else {
            home = other
            away = game
        }

        this.currHome = home
        this.currAway = away

        if (d3.select("#flexRadioDefault2").property("checked")) {
            this.drawchartSpread(home, away)
        }
        else {
            this.drawchartMoney(home, away)
        }
        //this.drawchartSpread(this.loadedData[1], this.loadedData[0])

        //this.drawchartMoney(this.loadedData[1], this.loadedData[0])
    }


    drawchartMoney(home, away) {
        let totalSites = [];

        totalSites.push(parseFloat(home["5dimes_ML"]))

        totalSites.push(parseFloat(home["Betonline_ML"]))

        totalSites.push(parseFloat(home["Bovada_ML"]))

        totalSites.push(parseFloat(home["Heritage_ML"]))

        totalSites.push(parseFloat(home["Pinnacle_ML"]))

        totalSites.push(parseFloat(away["5dimes_ML"]))

        totalSites.push(parseFloat(away["Betonline_ML"]))

        totalSites.push(parseFloat(away["Bovada_ML"]))

        totalSites.push(parseFloat(away["Heritage_ML"]))

        totalSites.push(parseFloat(away["Pinnacle_ML"]))


        let siteNames = ["5dimes", "Betonline", "Bovada", "Heritage", "Pinnacle"];

        const data = [{ name: "5dimes", money: home["5dimes_ML"], team: "home" }, { name: "Betonline", money: home["Betonline_ML"], team: "home" }, { name: "Bovada", money: home["Bovada_ML"], team: "home" }, { name: "Heritage", money: home["Heritage_ML"], team: "home" }, { name: "Pinnacle", money: home["Pinnacle_ML"], team: "home" },
        { name: "5dimes", money: away["5dimes_ML"], team: "away" }, { name: "Betonline", money: away["Betonline_ML"], team: "away" }, { name: "Bovada", money: away["Bovada_ML"], team: "away" }, { name: "Heritage", money: away["Heritage_ML"], team: "away" }, { name: "Pinnacle", money: away["Pinnacle_ML"], team: "away" }]


        var svgBar = d3.select("#bar-chart");

        //title
        svgBar
            .select("#BarChartTitle")
            .join('text')
            .text("Money Line")
            .attr("x", 170)
            .attr("y", 50)
            .style("font", "30px times")

        //home
        d3.
            select("#BarChartHome")
            .join('text')
            .text("= " + home["Team"])
            .attr("x", 160)
            .attr("y", 75)
            .style("font", "15px times")
            .style('fill', 'black')

        d3.
            select("#BarChartHomeRect")
            .join('rect')
            .attr("x", 140)
            .attr("y", 63)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#66ff66")

        //away
        d3.
            select("#BarChartAway")
            .join('text')
            .text("= " + away["Team"])
            .attr("x", 345)
            .attr("y", 75)
            .style("font", "15px times")
            .style('fill', 'black')

        d3.
            select("#BarChartAwayRect")
            .join('rect')
            .attr("x", 325)
            .attr("y", 63)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "steelblue")

        var yScale = d3
            .scaleLinear()
            .domain([d3.min(totalSites), d3.max(totalSites)])
            .range([75, 425])
            .nice();


        d3.select("#bar-y-axis")
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .style("font-size", "18")

        var xScale = d3.scaleBand()
            .domain(siteNames)
            .range([0, 450])
            .padding(0.4)

        d3.select("#bar-x-axis")
            .call(d3.axisBottom(xScale))
            .attr('transform', `translate(${this.margin.left}, ${475 - this.margin.top})`)
            .style("font-size", "18")

        d3.select("#bar-line")
            .selectAll("line")
            .data([0])
            .join('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", 0 + this.margin.left)
            .attr("y1", yScale(0) + this.margin.top)
            .attr("x2", 500)
            .attr("y2", yScale(0) + this.margin.top)

        d3.select("#bar-chart-rects")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.name) + this.margin.left)
            .attr("y", d => d.money < 0 ? yScale(d.money) + this.margin.top : yScale(0) + this.margin.top)
            .attr("width", xScale.bandwidth())
            .attr("height", d => d.money < 0 ? yScale(0) - yScale(d.money)  : yScale(d.money) - yScale(0))
            .attr("fill", d => d.team == "home" ? "#66ff66" : "steelblue")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
    }
    //takes in home team data and  away team data and draws the bar chart
    drawchartSpread(home, away) {

        // filter data into different lists

        //total spreads
        let totalSites = [];

        totalSites.push(parseFloat(home["5dimes_Line_Spread"]))

        totalSites.push(parseFloat(home["Betonline_Line_Spread"]))

        totalSites.push(parseFloat(home["Bovada_Line_Spread"]))

        totalSites.push(parseFloat(home["Heritage_Line_Spread"]))

        totalSites.push(parseFloat(home["Pinnacle_Line_Spread"]))

        totalSites.push(parseFloat(away["5dimes_Line_Spread"]))

        totalSites.push(parseFloat(away["Betonline_Line_Spread"]))

        totalSites.push(parseFloat(away["Bovada_Line_Spread"]))

        totalSites.push(parseFloat(away["Heritage_Line_Spread"]))

        totalSites.push(parseFloat(away["Pinnacle_Line_Spread"]))



        //add betting site names to a list
        let siteNames = ["5dimes", "Betonline", "Bovada", "Heritage", "Pinnacle"];



        //set up data structure
        const data = [{ name: "5dimes", spread: home["5dimes_Line_Spread"], team: "home" }, { name: "Betonline", spread: home["Betonline_Line_Spread"], team: "home" }, { name: "Bovada", spread: home["Bovada_Line_Spread"], team: "home" }, { name: "Heritage", spread: home["Heritage_Line_Spread"], team: "home" }, { name: "Pinnacle", spread: home["Pinnacle_Line_Spread"], team: "home" },
        { name: "5dimes", spread: away["5dimes_Line_Spread"], team: "away" }, { name: "Betonline", spread: away["Betonline_Line_Spread"], team: "away" }, { name: "Bovada", spread: away["Bovada_Line_Spread"], team: "away" }, { name: "Heritage", spread: away["Heritage_Line_Spread"], team: "away" }, { name: "Pinnacle", spread: away["Pinnacle_Line_Spread"], team: "away" }]


        // bar text

        var svgBar = d3.select("#bar-chart");

        //title
        svgBar
            .select("#BarChartTitle")
            .join('text')
            .text("Line Spread")
            .attr("x", 170)
            .attr("y", 50)
            .style("font", "30px times")

        //home
        //home
        d3.
            select("#BarChartHome")
            .join('text')
            .text("= " + home["Team"])
            .attr("x", 160)
            .attr("y", 75)
            .style("font", "15px times")
            .style('fill', 'black')

        d3.
            select("#BarChartHomeRect")
            .join('rect')
            .attr("x", 140)
            .attr("y", 63)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#66ff66")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)

        //away
        d3.
            select("#BarChartAway")
            .join('text')
            .text("= " + away["Team"])
            .attr("x", 345)
            .attr("y", 75)
            .style("font", "15px times")
            .style('fill', 'black')
            

        d3.
            select("#BarChartAwayRect")
            .join('rect')
            .attr("x", 325)
            .attr("y", 63)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)

        //yScale

        var yScale = d3
            .scaleLinear()
            .domain([d3.min(totalSites), d3.max(totalSites)])
            .range([75, 425])
            .nice();


        d3.select("#bar-y-axis")
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .style("font-size", "18")


        //xScale and x-axis

        var xScale = d3.scaleBand()
            .domain(siteNames)
            .range([0, 450])
            .padding(0.4)

        d3.select("#bar-x-axis")
            .call(d3.axisBottom(xScale))
            .attr('transform', `translate(${this.margin.left}, ${475 - this.margin.top})`) //${yScale(0) + this.margin.top}
            .style("font-size", "18")
        //middle line of bar
        d3.select("#bar-line")
            .selectAll("line")
            .data([0])
            .join('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", 0 + this.margin.left)
            .attr("y1", yScale(0) + this.margin.top)
            .attr("x2", 500)
            .attr("y2", yScale(0) + this.margin.top)


        //draw bars in chart
        d3.select("#bar-chart-rects")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.name) + this.margin.left)
            .attr("y", d => d.spread < 0 ? yScale(d.spread) + this.margin.top : yScale(0) + this.margin.top)
            .attr("width", xScale.bandwidth())
            .attr("height", d => d.spread < 0 ? yScale(0) - yScale(d.spread) : yScale(d.spread) - yScale(0))
            .attr("fill", d => d.team == "home" ? "#66ff66" : "steelblue")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)

    }
}