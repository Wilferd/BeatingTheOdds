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
    return season18_19
}

loadData().then((loadedData) => {
    console.log(loadedData);
    document.body.style.zoom = "67%";
    const BC = new BarChart(loadedData);
    const lineView = new LineChart(loadedData, BC);
    const chord = new ChordDiagram(loadedData);
});
