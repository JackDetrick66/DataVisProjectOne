
let barchart;
let barchart2;
let scatter;
// Load the data before doing anything to create the charts
Promise.all([
    d3.csv('data/life-expectancy-prados-de-la-escosura.csv'),
    d3.csv('data/mean-years-of-schooling-long-run.csv')
]).then(([dataLife, dataSchool]) => {
    
    const rollup = d3.rollup(dataLife,
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
    barchart = new Barchart({ parentElement: '#chart', yAxisLabel:'Life Expectancy'}, avgData);
    barchart.updateVis();

    
    const rollup2 =d3.rollup(dataSchool,
        group => d3.mean(group, d=> +d['Average years of schooling']),
        d=>d.Entity
    )
    const avgData2 = Array.from(rollup2, ([entity, avgYearsSchooling]) => ({
        Entity: entity,
        'Years of schooling': avgYearsSchooling
    }))
    console.log('avgData2:', avgData2);
    console.log('avgData2 length:', avgData2.length);
    avgData2.sort((a,b) => b['Years of schooling'] - a['Years of schooling']);
    barchart2 = new Barchart({ parentElement: '#chart2', yAxisLabel: 'Years of Schooling'}, avgData2);
    barchart2.updateVis();

    const combined = avgData.map(d => ({
    ...d,
    'Years of schooling': avgData2.find(d2=>d2.Entity === d.Entity)?.['Years of schooling'] ?? 0
    }))

    
    scatter = new Scatterplot({parentElement: '#scatter', yAxisLabel: 'Average'}, combined);
    scatter.updateVis();

})


 

d3.select('#sorting').on('click', d => {
  barchart.config.reverseOrder = true;
  barchart.updateVis();
})
//This is to map the two datasets into one object.
