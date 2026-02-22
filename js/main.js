
let barchart;
let barchart2;
let scatter;
let choro;
function updateAllCharts(){
    choro.updateVis();
    barchart.updateVis();
    barchart2.updateVis();
    scatter.updateVis();
}
// Load the data before doing anything to create the charts
Promise.all([
    d3.csv('data/life-expectancy-prados-de-la-escosura.csv'),
    d3.csv('data/mean-years-of-schooling-long-run.csv'),
    d3.json('data/geo.json')
]).then(([dataLife, dataSchool, geoData]) => {
    
    const rollup = d3.rollup(dataLife,
        group => ({
            avgLifeExpectancy: parseFloat(d3.mean(group, d=> +d['Life expectancy'])).toFixed(2),
            region: group[0]['World region according to OWID']
        }),
        d => d.Entity
    )
    const avgData = Array.from(rollup, ([entity, values]) => ({
    Entity: entity,
    'Life expectancy': values.avgLifeExpectancy,
    region: values.region
    }))
    console.log('avgData:', avgData);
    console.log('avgData length:', avgData.length);
    
    avgData.sort((a,b) => b['Life expectancy'] - a['Life expectancy']);


    // Initialize chart and then show it
    barchart = new Barchart({ parentElement: '#chart', yAxisLabel:'Life Expectancy'}, avgData);
    barchart.updateVis();

    
    const rollup2 = d3.rollup(dataSchool,
        group => ({
            avgYearsSchooling: parseFloat(d3.mean(group, d => +d['Average years of schooling'])).toFixed(2),
            region: group[0]['Entity']
        }),
        d => d.Entity
    )
    const avgData2 = Array.from(rollup2, ([entity, values]) => ({
    Entity: entity,
    'Years of schooling': values.avgYearsSchooling,
    region: avgData.find(d => d.Entity === entity)?.region ?? null
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


    geoData.features.forEach(d=> {
        for(let i = 0; i < avgData.length; i++){
            if(d.properties.name == avgData[i].Entity) {
                d.properties.lifeExp = +avgData[i]['Life expectancy'],
                d.properties.region = avgData[i].region;
            }
        }
    });
    choro = new ChoroplethMap({
        parentElement: '#map'
    }, geoData);
    choro.updateVis();


    initDropdown(updateAllCharts);

})
.catch(error => console.error(error));


d3.select('#sorting').on('click', d => {
  barchart.config.reverseOrder = true;
  barchart.updateVis();
})

//This is to map the two datasets into one object.
