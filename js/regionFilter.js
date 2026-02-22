let selectedRegion = "all";

const regionColor = d3.scaleOrdinal(d3.schemeTableau10);

function getOpacity(regionValue){
    if(selectedRegion == "all") return 1;
    return regionValue == selectedRegion ? 1:0.15;
}

function getColor(regionValue){
    if(selectedRegion == "all") return "steelblue";
    return regionValue == selectedRegion ? regionColor(regionValue) : "#ccc";
}

function initDropdown(onChangeFn){
    d3.select("#regionSelect").on("change", function(){
        selectedRegion = this.value;
        onChangeFn();
    });
}