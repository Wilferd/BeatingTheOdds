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

        totalSites.push(home["5dimes_Line_Spread"])

        totalSites.push(home["Betonline_Line_Spread"])

        totalSites.push(home["Bovada_Line_Spread"])

        totalSites.push(home["Heritage_Line_Spread"])

        totalSites.push(home["Pinnacle_Line_Spread"])

        totalSites.push(away["5dimes_Line_Spread"])

        totalSites.push(away["Betonline_Line_Spread"])

        totalSites.push(away["Bovada_Line_Spread"])

        totalSites.push(away["Heritage_Line_Spread"])

        totalSites.push(away["Pinnacle_Line_Spread"])

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

        
        
        const data = {

            siteName: siteNames,

            spread: totalSites
            
        };

        var svgBar = d3.select("#bar-chart");

        svgBar
        .append("text")
        .text("Single Game Spread")
        .attr("x", 140)
        .attr("y", 50)
        .style("font", "30px times")

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
        .attr('transform', `translate(${this.margin.left}, ${259})`)

        var barScale = d3.scaleBand()
        .domain([d3.min(totalSites)])

        //create an object with name, spread, and team properties for data
        d3.select("#bar-chart-rects")
        .selectAll("rect")
        .data(siteNames)
        .join("rect")
        .attr("x", d => xScale(d) + this.margin.left)
        .attr("y", 160)
        .attr("width", xScale.bandwidth())
        .attr("height", 100)
        .attr("fill", "steelblue")


    }
}