
// https://d3-geomap.github.io/map/choropleth/world/

var format = function(d) {
    d = d / 1000;
    return d3.format(',.02f')(d) + ' K';
}

//updates the year to display, changing colors and tooltip values
var updateYear = function(newYear) {
   d3.select('.yearlabel').text("Current year: " + newYear);
   map.properties.column = newYear;

   // Add new fill styles based on data values.
   map.data.forEach(function (d) {
       var uid = d[map.properties.unitId],
           val = d[map.properties.column],
           fill = map.colorScale(val);

       // selectAll must be called and not just select, otherwise the data
       // attribute of the selected path object is overwritten with map.data.
       var unit = map.svg.selectAll('.' + map.properties.unitPrefix + '' + uid);

       // Data can contain values for non existing units.
       if (!unit.empty()) {
           if (map.properties.duration) unit.transition().duration(map.properties.duration).style('fill', fill);else unit.style('fill', fill);

           // New title with column and value.
           var text = map.properties.unitTitle(unit.datum());
           val = map.properties.format(val);
           unit.select('title').text('' + text + '\n\n' + map.properties.column + ': ' + val);
       }
   });
}

var years = ['1962', '1967', '1972', '1977', '1982', '1987',
             '1992', '1997', '2002', '2007', '2012', '2014'];

var stepYear = function() {
    if (typeof stepYear.i == 'undefined') stepYear.i = 0;
    updateYear(years[stepYear.i]);
    stepYear.i = (stepYear.i + 1) % years.length;
}

animate = function() {
    setInterval(stepYear, 1000);
}

var map = d3.geomap.choropleth()
    .geofile('countries.json')
    .column('2014')
    .colors(colorbrewer.RdYlBu[9])
    .domain([1000, 10000])
    .format(format)
    .legend(true)
    .unitId('Country Code')
    .scale(0,100000)
    .duration('1000');

d3.csv('water_res_full_formatted.csv', function(error, data) {
    console.log(data);
    d3.select('#map')
        .datum(data)
       .call(map.draw, map);
});

