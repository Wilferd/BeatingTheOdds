class ChordDiagram {
    constructor(loadedData){
        this.loadedData = loadedData;
        this.teams = [];
        this.teamNames = new Set();
        loadedData.forEach(game => this.teamNames.add(game.Team));
        this.teamNames.forEach(team => this.teams.push({team: team}) );
        console.log(this.teams);
        console.log(this.teamNames);


        this.margin = {top: 50, right: 50, bottom: 50, left: 50};
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;

        this.diameter = this.width;
        this.radius = this.diameter / 2;
        this.innerRadius = this.radius - 120;

        const scale = d3.scaleLinear()
            .domain([0, this.teams.length])
            .range([0, 2 * Math.PI]);
        
        for(let [i, d] of this.teams.entries()){
            var theta = scale(i);
            d.x = this.radius * Math.sin(theta)+ 350;
            d.y = this.radius * Math.cos(theta) + 370;
        }

        let diagram = d3.select('#chord-diagram');


        let nodes = d3.select('#chord-labels')
            .selectAll('text')
            .data(this.teams)
            .join("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .text(d=>d.team);
    }
}