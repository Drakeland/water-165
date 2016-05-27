
// https://d3-geomap.github.io/map/choropleth/world/

var format = function(d) {
    d = d / 1000;
    return d3.format(',.02f')(d) + ' K';
}

var map = d3.geomap.choropleth()
    .geofile('countries.json')
    .column('2013-2017')
    .colors(colorbrewer.RdYlBu[9])
    .domain([1000, 10000])
    .format(format)
    .legend(true)
    .unitId('Country Code')
    .scale(0,100000);

d3.csv('water_resources_1yr.csv', function(error, data) {
    console.log(data);
    d3.select('#map')
        .datum(data)
       .call(map.draw, map);
});

