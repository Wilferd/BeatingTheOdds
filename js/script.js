async function loadData() {

    return await d3.csv('./data/2018-19/vegas.txt');;
}

loadData().then((loadedData) => {
    console.log(loadedData)
});
