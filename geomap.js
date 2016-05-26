
// https://d3-geomap.github.io/map/choropleth/world/

var format = function(d) {
    d = d / 1000;
    return d3.format(',.02f')(d) + 'K';
}

var map = d3.geomap.choropleth()
    .geofile('countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column('2013-2017')
    .format(format)
    .legend(true)
    .unitId('Country Code');

d3.csv('water_resources_1yr.csv', function(error, data) {
    console.log(data);
    d3.select('#map')
        .datum(data)
        .call(map.draw, map);
});