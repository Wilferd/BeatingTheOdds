class BarChart {
    constructor(loadedData)
    {
        this.loadedData = loadedData;
        this.margin = {left: 25, right:50, top: 25, bottom:25}
        

        this.drawchart(this.loadedData[1], this.loadedData[0])


        
        
    }

    drawchart(home, away)
    {
        

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

        let homeSites = [];

        homeSites.push(home["5dimes_Line_Spread"])

        homeSites.push(home["Betonline_Line_Spread"])

        homeSites.push(home["Bovada_Line_Spread"])

        homeSites.push(home["Heritage_Line_Spread"])

        homeSites.push(home["Pinnacle_Line_Spread"])

        let awaySites = [];

        awaySites.push(away["5dimes_Line_Spread"])

        awaySites.push(away["Betonline_Line_Spread"])

        awaySites.push(away["Bovada_Line_Spread"])

        awaySites.push(away["Heritage_Line_Spread"])

        awaySites.push(away["Pinnacle_Line_Spread"])

        

        awaySites.push(away["Heritage_Line_Spread"])

        let siteNames = ["5dimes", "Betonline", "Bovada", "Heritage", "Pinnacle"];

        
        

        const data = [{name:"5dimes", spread: home["5dimes_Line_Spread"], team: "home"}, {name:"Betonline", spread:home["Betonline_Line_Spread"], team: "home"}, {name:"Bovada", spread:home["Bovada_Line_Spread"], team: "home"}, {name:"Heritage", spread:home["Heritage_Line_Spread"], team: "home"}, {name:"Pinnacle", spread:home["Pinnacle_Line_Spread"], team: "home"}, 
        {name:"5dimes", spread: away["5dimes_Line_Spread"], team: "away"}, {name:"Betonline", spread:away["Betonline_Line_Spread"], team: "away"}, {name:"Bovada", spread:away["Bovada_Line_Spread"], team: "away"}, {name:"Heritage", spread:away["Heritage_Line_Spread"], team: "away"}, {name:"Pinnacle", spread:away["Pinnacle_Line_Spread"], team: "away"}]
        


        var svgBar = d3.select("#bar-chart");

        svgBar
        .append("text")
        .text("Single Game Spread")
        .attr("x", 140)
        .attr("y", 50)
        .style("font", "30px times")

        svgBar
        .append("text")
        .text("Home")
        .attr("x", 140)
        .attr("y", 75)
        .style("font", "15px times")
        .style('fill', '#66ff66')

        svgBar
        .append("text")
        .text("Away")
        .attr("x", 350)
        .attr("y", 75)
        .style("font", "15px times")
        .style('fill', 'steelblue')

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
        .attr('transform', `translate(${this.margin.left}, ${475 - this.margin.top})`) //${yScale(0) + this.margin.top}


        d3.select("#bar-line")
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", 0 + this.margin.left)
        .attr("y1", yScale(0) + this.margin.top)
        .attr("x2", 500)
        .attr("y2", yScale(0) + this.margin.top)
        

        var barScale = d3.scaleBand()
        .domain([d3.min(totalSites)])

       
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