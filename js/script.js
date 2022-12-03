var season12_13 = null;
var season13_14 = null;
var season14_15 = null;
var season15_16 = null;
var season16_17 = null;
var season17_18 = null;
var season18_19 = null;




async function loadData() {
    season12_13 = await d3.csv('./data/2012-13/vegas.txt');
    season13_14 = await d3.csv('./data/2013-14/vegas.txt');
    season14_15 = await d3.csv('./data/2014-15/vegas.txt');
    season15_16 = await d3.csv('./data/2015-16/vegas.txt');
    season16_17 = await d3.csv('./data/2016-17/vegas.txt');
    season17_18 = await d3.csv('./data/2017-18/vegas.txt');
    season18_19 = await d3.csv('./data/2018-19/vegas.txt');
    return season12_13
}

loadData().then((loadedData) => {
    document.body.style.zoom = "67%";
    update(loadedData); 
    d3.select("#season12-13").on("click", d=> {
        update(season12_13);
    });
    d3.select("#season13-14").on("click", d=> {
        update(season13_14);
    }
    );
    d3.select("#season14-15").on("click", d=> {
        update(season14_15);
    }
    );
    d3.select("#season15-16").on("click", d=> {
        update(season15_16);
    }
    );
    d3.select("#season16-17").on("click", d=> {
        update(season16_17);
    }
    );
    d3.select("#season17-18").on("click", d=> {
        update(season17_18);
    }
    );
    d3.select("#season18-19").on("click", d=> {
        update(season18_19);
    }
    );
});


function update(data){
    const BC = new BarChart(data);
    const lineView = new LineChart(data, BC);
    const chord = new ChordDiagram(data);
}