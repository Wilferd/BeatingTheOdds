class ChordDiagram {
    constructor(loadedData){
        this.state =
        {
            selectedTeam: null,
        }
        this.loadedData = loadedData;
        this.teams = [];
        this.teamNames = new Set();
        loadedData.forEach(game => this.teamNames.add(game.Team));
        this.teamNames.forEach(team => this.teams.push({team: team}));
        console.log(d3.group(loadedData, d => d.Team))
        
        this.imageWidth = 50;
        this.imageHeight = 56;


        this.margin = {top: 100, right: 100, bottom: 100, left: 100};
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;

        this.diameter = this.width;
        this.radius = this.diameter / 2;
        this.innerRadius = this.radius - 120;

        this.assignPositions()

        d3.select('#chord-images')
            .selectAll("image")
            .data(this.teams, d=>d.team)
            .join('image')
            .attr('x', d => d.x - this.imageWidth / 2)
            .attr('y', d => d.y - this.imageHeight / 2)
            .attr('width', this.imageWidth)
            .attr('height', this.imageHeight)
            .attr("xlink:href", d => `logos/${d.team}.png`)

        d3.select('#chord-images').on("click", (d) => {
            this.state.selectedTeam = d.srcElement.__data__.team;
            console.log(this.state.selectedTeam)
            this.assignPositions()
            this.update()
        })
    }

    update(){
        d3.select('#chord-images')
            .selectAll("image")
            .data(this.teams, d=>d.team)
            .join('image')
            .transition()
            .duration(1000)
            .attr('x', d => d.x - this.imageWidth / 2)
            .attr('y', d => d.y - this.imageHeight / 2)
            .attr('width', this.imageWidth)
            .attr('height', this.imageHeight)
            .attr("xlink:href", d => `logos/${d.team}.png`)
    }

    assignPositions(){
        const scale = d3.scaleLinear()
        .domain([0, this.teams.length])
        .range([0, 2 * Math.PI]);
        if(this.state.selectedTeam){
            let team = JSON.parse(JSON.stringify(this.teams.filter(d => d.team === this.state.selectedTeam)[0]))
            console.log(this.teams.map(d=>d.team).indexOf(this.state.selectedTeam))
            this.teams = this.teams.filter(d => d.team !== this.state.selectedTeam)
            this.teams.splice(15, 0, team)
        }
        console.log(this.teams)
        for(let [i, d] of this.teams.entries()){
            var theta = scale(i);
            d.x = this.radius * Math.sin(theta)+ 350;
            d.y = this.radius * Math.cos(theta) + 350;
        }
    }
}