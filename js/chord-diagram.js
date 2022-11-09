class ChordDiagram {
    constructor(loadedData){
        this.loadedData = loadedData;
        this.teams = new Set();
        this.margin = {top: 50, right: 50, bottom: 50, left: 50};

        for(let game of this.loadedData){
            this.teams.add(game["Team"]);
        }

        let diagram = d3.select('#chord-diagram');

        let nodes = diagram
            .data(this.teams)
            .join("text")
            .attr("dy", "0.31em")
            // .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
            // .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .text(function(d) { return d; });
    }
}