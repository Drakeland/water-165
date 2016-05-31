#data formatter. writes a complete table for all years in range,
#replacing data values for years for which data is missing with -1.

#unformatted FAO multi-country, multi-year dataset
data_inFile = open('water_res_full_unformatted.csv','r')
countries = dict()

# bind countries to year : value pairs
for line in data_inFile.readlines():
    word = line.split(',')
   #skip column label line   
    if word[0] == "Area":
        pass
    else:
         #strip trailing newline chracter from data entries
        if word[3].endswith('\n'):
            word[3]=word[3].rstrip('\n')
         #create new countries dict entry if country hasnt been encountered yet
        if word[0] not in countries:        
            countries[word[0]] = {'Country Code':'none', '1962':-1,'1967':-1,'1972':-1,'1977':-1,'1982':-1,'1987':-1,'1992':-1,'1997':-1,'2002':-1,'2007':-1,'2012':-1,'2014':-1}
         #copy the data value for the given country and year into countries 
        countries[word[0]][word[2]] = word[3]    
data_inFile.close()

#bind 3-letter country codes to countries
country_code_inFile = open ('water_resources_1yr.csv', 'r')
for line in country_code_inFile.readlines():
    word = line.split(',')
    
    if word[1] in countries:
        countries[word[1]]['Country Code'] = word[0]
    
country_code_inFile.close()

#write formatted countries data to file
outFile = open ('water_res_full_formatted.csv', 'w')

years = {'1962','1967','1972','1977','1982','1987','1992','1997','2002','2007','2012','2014'}
years = sorted(years,key=str)
country_names = sorted(countries.keys(),key=str)   

#write column titles on first line
outFile.write('Country Code,Country')
for year in years:
   outFile.write(','+year)
outFile.write('\n')

#write each country's code, name, then data for each year
for elements in country_names:
    outFile.write(countries[elements]['Country Code']+','+elements)
      
    for x in years:
        outFile.write(','+str(countries[elements][x]))
    outFile.write('\n')
    
outFile.close()
