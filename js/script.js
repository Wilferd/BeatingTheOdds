async function loadData() {

    return await d3.csv('./data/2018-19/vegas.txt');
}

loadData().then((loadedData) => {
    console.log(loadedData)
    const BC = new BarChart(loadedData);
    console.log(loadedData);
    const lineView = new LineChart(loadedData);
    const chord = new ChordDiagram(loadedData);
});
