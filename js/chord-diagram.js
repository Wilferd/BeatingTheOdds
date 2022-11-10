class ChordDiagram {
    constructor(loadedData){
        this.loadedData = loadedData;
        this.teams = [];
        this.teamNames = new Set();
        loadedData.forEach(game => this.teamNames.add(game.Team));
        this.teamNames.forEach(team => this.teams.push({team: team}) );
        
        const imageWidth = 50;
        const imageHeight = 56;


        this.margin = {top: 100, right: 100, bottom: 100, left: 100};
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
            d.y = this.radius * Math.cos(theta) + 350;
        }

        d3.select('#chord-images')
            .selectAll("image")
            .data(this.teams)
            .join('image')
            .attr('x', d => d.x - imageWidth / 2)
            .attr('y', d => d.y - imageHeight / 2)
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr("xlink:href", d => `logos/${d.team}.png`)
    }
}