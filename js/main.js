/**
 * Load data from CSV file asynchronously and render bar chart
 */
let barchart;
d3.csv('data/life-expectancy-prados-de-la-escosura.csv')
  .then(data => {

    // Sort data by population
    
    const rollup = d3.rollup(data,
        group => d3.mean(group, d=> +d['Life expectancy']),
        d => d.Entity
    )
    const avgData = Array.from(rollup, ([entity, avgLifeExpectancy]) => ({
        Entity: entity,
        'Life expectancy': avgLifeExpectancy
    }))
    console.log('avgData:', avgData);
    console.log('avgData length:', avgData.length);
    
    avgData.sort((a,b) => b['Life expectancy'] - a['Life expectancy']);


    // Initialize chart and then show it
    barchart = new Barchart({ parentElement: '#chart'}, avgData);
    barchart.updateVis();
  })
  .catch(error => console.error(error));


/**
 * Event listener: change ordering
 */
/*
var changeSortingOrder = d3.select("#change-sorting").on("click", function() {
    reverse = !reverse;
    updateVisualization();
});
*/

d3.select('#sorting').on('click', d => {
  barchart.config.reverseOrder = true;
  barchart.updateVis();
})