async function loadData() {

    return await d3.csv('./data/2018-19/vegas.txt');
}

loadData().then((loadedData) => {
    document.body.style.zoom = "67%";
    console.log(loadedData)
    const BC = new BarChart(loadedData);
    const lineView = new LineChart(loadedData);
    const chord = new ChordDiagram(loadedData);
});
