class ChordDiagram {
    constructor(loadedData){
        this.state =
        {
            selectedTeam: "Utah",
        }
        this.loadedData = loadedData;
        this.teams = [];
        this.teamNames = new Set();
        loadedData.forEach(game => this.teamNames.add(game.Team));
        this.teamNames.forEach(team => this.teams.push({team: team}));

        this.teams.forEach(team => team.data = d3.group(loadedData, d => d.Team).get(team.team))
        
        var winLoseColorScale = d3.scaleOrdinal()
            .domain([0,4])
            .range(["red","green"]);

        this.imageWidth = 60;
        this.imageHeight = 60;


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

        this.update()

        d3.select('#chord-images').on("click", (d) => {
            this.state.selectedTeam = d.srcElement.__data__.team;
            console.log(this.state.selectedTeam)
            this.assignPositions()
            this.update()
        })
    }

    update(){
        d3.select("#chord-lines")
            .selectAll("line")
            .data(this.teams.filter(d => d.team === this.state.selectedTeam)[0].data)
            .join('line')
            .attr('x1', d => this.teams.filter(d2 => d2.team === d.Team)[0].x)
            .attr('y1', d => this.teams.filter(d2 => d2.team === d.Team)[0].y)
            .attr('x2', d => this.teams.filter(d2 => d2.team === d.OppTeam)[0].x)
            .attr('y2', d => this.teams.filter(d2 => d2.team === d.OppTeam)[0].y)
            .attr("stroke-width", 3)
            .attr("stroke", d=>d.Result === 'W' ? 'green' : 'red')

        d3.select('#chord-images')
            .selectAll("image")
            .data(this.teams, d=>d.team)
            .join('image')
            .transition()
            .duration(500)
            .attr('x', d => d.x - this.imageWidth / 2)
            .attr('y', d => d.y - this.imageHeight / 2)
            .attr('width', this.imageWidth)
            .attr('height', this.imageHeight)
            .attr("xlink:href", d => `logos/${d.team}.png`)

        d3.select("#chord-images").raise()

    }

    assignPositions(){
        const scale = d3.scaleLinear()
        .domain([1, this.teams.length])
        .range([0, 2 * Math.PI]);

        if(this.state.selectedTeam){
            let team = JSON.parse(JSON.stringify(this.teams.filter(d => d.team === this.state.selectedTeam)[0]))
            this.shuffleArray(this.teams)
            this.teams = this.teams.filter(d => d.team !== this.state.selectedTeam)
            this.teams.splice(0, 0, team)
        }
        console.log(this.teams)
        for(let [i, d] of this.teams.entries()){
            if(i === 0){
                d.x = 350;
                d.y = 350;

                continue
            }
            var theta = scale(i);
            d.x = this.radius * Math.sin(theta)+ 350;
            d.y = this.radius * Math.cos(theta) + 350;
        }
    }

    calculateWins(){

    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}