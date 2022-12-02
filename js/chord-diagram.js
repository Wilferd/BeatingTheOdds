class ChordDiagram {
    constructor(loadedData){
        this.state =
        {
            selectedTeam: "Utah",
            shuffle: false
        }
        this.loadedData = loadedData;
        this.teams = [];
        this.teamNames = new Set();
        loadedData.forEach(game => this.teamNames.add(game.Team));
        this.teamNames.forEach(team => this.teams.push({team: team}));

        this.teams.forEach(team => team.groupedData = d3.group(loadedData, d => d.Team).get(team.team))
        
        this.winLoseColorScale = d3.scaleSequential()
            .domain([0,1])
            .interpolator(d3.interpolate("lightcoral", "lightgreen"));

        this.imageWidth = 60;
        this.imageHeight = 60;


        this.margin = {top: 100, right: 100, bottom: 100, left: 100};
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;

        this.diameter = this.width;
        this.radius = this.diameter / 2;
        this.innerRadius = this.radius - 120;

        this.assignPositions()
        this.calculateWins()
        this.calculateSpread()

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

        d3.select("#shuffle-effect-switch").on("click", ()=>{
            let checked = d3.select('#shuffle-effect-switch-flex').property('checked');
            this.state.shuffle = checked;
        })

        d3.select("#wins-radio-button").on("click", ()=>{
        
        
            this.update()})

        d3.select("#spread-radio-button").on("click", ()=>{
            this.update()
        })
    }

    update(){

        let selectedTeam = this.teams.filter(d => d.team === this.state.selectedTeam)[0]
        if(d3.select("#wins-radio-button").property("checked")){
            d3.select("#chord-lines")
                .selectAll("line")
                .data(selectedTeam["winLoseData"])
                .join('line')
                .attr('x1', selectedTeam.x)
                .attr('y1', selectedTeam.y)
                .attr('x2', d => this.teams.filter(d2 => d2.team === d.team)[0].x)
                .attr('y2', d => this.teams.filter(d2 => d2.team === d.team)[0].y)
                .attr("stroke-width", 10)
                .attr("stroke", d=> this.winLoseColorScale(d.wins/d.total)
                )
                .attr("stroke-linecap", "round")
        }else if(d3.select("#spread-radio-button").property("checked")){
            d3.select("#chord-lines")
                .selectAll("line")
                .data(selectedTeam["spreadData"])
                .join('line')
                .attr('x1', selectedTeam.x)
                .attr('y1', selectedTeam.y)
                .attr('x2', d => this.teams.filter(d2 => d2.team === d.team)[0].x)
                .attr('y2', d => this.teams.filter(d2 => d2.team === d.team)[0].y)
                .attr("stroke-width", 10)
                .attr("stroke", d=> this.winLoseColorScale(d.covered/d.total)
                )
                .attr("stroke-linecap", "round")
        }

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
            if(this.state.shuffle){
                this.shuffleArray(this.teams)
            }
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
        this.teams.forEach(team => {
            team.winLoseData = []
            
            this.teams.forEach(t => {
                var winLoseObj = {};
                winLoseObj["team"] = t.team;
                winLoseObj["wins"] = 0;
                winLoseObj["total"] = 0;
                team.winLoseData.push(winLoseObj)
            })

            team.groupedData.forEach(game => {
                var winLoseObj = team.winLoseData.filter(d => d.team === game.OppTeam)[0]
                if(game.Result === 'W'){
                    winLoseObj.wins += 1
                }
                winLoseObj.total += 1
            }
            )
        })
        console.log(this.teams)
    }

    calculateSpread(){
        this.teams.forEach(team => {
            team.spreadData = []
            
            this.teams.forEach(t => {
                var spreadObj = {};
                spreadObj["team"] = t.team;
                spreadObj["covered"] = 0;
                spreadObj["total"] = 0;
                team.spreadData.push(spreadObj)
            })

            team.groupedData.forEach(game => {
                var spreadObj = team.spreadData.filter(d => d.team === game.OppTeam)[0]
                if(game.Result === 'W' && Math.abs(game.Spread) < game.Average_Line_Spread){
                    spreadObj.covered += 1
                }else if(game.Spread > Math.abs(game.Average_Line_Spread)){
                    spreadObj.covered += 1
                }
                spreadObj.total += 1
            }
            )
        })
        console.log(this.teams)
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