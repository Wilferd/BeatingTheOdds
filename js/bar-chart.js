class BarChart {
    constructor(loadedData)
    {
        this.loadedData = loadedData;
        this.margin = {left: 30, right:50, top: 25, bottom:25}
        

        this.drawchartSpread(this.loadedData[1], this.loadedData[0])

        //this.drawchartMoney(this.loadedData[1], this.loadedData[0])
        
    }

    drawchartMoney(home, away)
    {
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

        const data = [{name:"5dimes", money: home["5dimes_ML"], team: "home"}, {name:"Betonline", money:home["Betonline_ML"], team: "home"}, {name:"Bovada", money: home["Bovada_ML"], team: "home"}, {name:"Heritage", money: home["Heritage_ML"], team: "home"}, {name:"Pinnacle", money: home["Pinnacle_ML"], team: "home"},
        {name:"5dimes", money: away["5dimes_ML"], team: "away"}, {name:"Betonline", money:away["Betonline_ML"], team: "away"}, {name:"Bovada", money: away["Bovada_ML"], team: "away"}, {name:"Heritage", money: away["Heritage_ML"], team: "away"}, {name:"Pinnacle", money: away["Pinnacle_ML"], team: "away"}]
        
        
        var svgBar = d3.select("#bar-chart");

        //title
        svgBar
        .append("text")
        .text("Single Game Money Line")
        .attr("x", 140)
        .attr("y", 50)
        .style("font", "30px times")

        //home
        svgBar
        .append("text")
        .text("= " + home["Team"])
        .attr("x", 160)
        .attr("y", 75)
        .style("font", "15px times")
        .style('fill', 'black')

        svgBar
        .append("rect")
        .attr("x", 140)
        .attr("y", 63)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#66ff66")

        //away
        svgBar
        .append("text")
        .text("= " + away["Team"])
        .attr("x", 345)
        .attr("y", 75)
        .style("font", "15px times")
        .style('fill', 'black')

        svgBar
        .append("rect")
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
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        var xScale = d3.scaleBand()
        .domain(siteNames)
        .range ([0, 475])
        .padding(0.4)

        d3.select("#bar-x-axis")
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(${this.margin.left}, ${475 - this.margin.top})`)

        d3.select("#bar-line")
        .append("line")
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
        .attr("height", d => d.money < 0 ? yScale(0) - yScale(d.money) + this.margin.top : yScale(d.money) - yScale(0))
        .attr("fill", d => d.team == "home" ? "#66ff66" : "steelblue")
    }
    //takes in home team data and  away team data and draws the bar chart
    drawchartSpread(home, away)
    {
        
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
        const data = [{name:"5dimes", spread: home["5dimes_Line_Spread"], team: "home"}, {name:"Betonline", spread:home["Betonline_Line_Spread"], team: "home"}, {name:"Bovada", spread:home["Bovada_Line_Spread"], team: "home"}, {name:"Heritage", spread:home["Heritage_Line_Spread"], team: "home"}, {name:"Pinnacle", spread:home["Pinnacle_Line_Spread"], team: "home"}, 
        {name:"5dimes", spread: away["5dimes_Line_Spread"], team: "away"}, {name:"Betonline", spread:away["Betonline_Line_Spread"], team: "away"}, {name:"Bovada", spread:away["Bovada_Line_Spread"], team: "away"}, {name:"Heritage", spread:away["Heritage_Line_Spread"], team: "away"}, {name:"Pinnacle", spread:away["Pinnacle_Line_Spread"], team: "away"}]
        

        // bar text

        var svgBar = d3.select("#bar-chart");

        //title
        svgBar
        .append("text")
        .text("Single Game Spread")
        .attr("x", 140)
        .attr("y", 50)
        .style("font", "30px times")

        //home
         //home
         svgBar
         .append("text")
         .text("= " + home["Team"])
         .attr("x", 160)
         .attr("y", 75)
         .style("font", "15px times")
         .style('fill', 'black')
 
         svgBar
         .append("rect")
         .attr("x", 140)
         .attr("y", 63)
         .attr("width", 15)
         .attr("height", 15)
         .attr("fill", "#66ff66")
 
         //away
         svgBar
         .append("text")
         .text("= " + away["Team"])
         .attr("x", 345)
         .attr("y", 75)
         .style("font", "15px times")
         .style('fill', 'black')
 
         svgBar
         .append("rect")
         .attr("x", 325)
         .attr("y", 63)
         .attr("width", 15)
         .attr("height", 15)
         .attr("fill", "steelblue")

        //yScale

        var yScale = d3
        .scaleLinear()
        .domain([d3.min(totalSites), d3.max(totalSites)])
        .range([75, 425])
        .nice();


        d3.select("#bar-y-axis")
        .call(d3.axisLeft(yScale))
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        

        //xScale and x-axis

        var xScale = d3.scaleBand()
        .domain(siteNames)
        .range ([0, 475])
        .padding(0.4)

        d3.select("#bar-x-axis")
        .call(d3.axisBottom(xScale))
        .attr('transform', `translate(${this.margin.left}, ${475 - this.margin.top})`) //${yScale(0) + this.margin.top}

        //middle line of bar
        d3.select("#bar-line")
        .append("line")
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
        .attr("height", d => d.spread < 0 ? yScale(0) - yScale(d.spread) + this.margin.top : yScale(d.spread) - yScale(0))
        .attr("fill", d => d.team == "home" ? "#66ff66" : "steelblue")

    }
}