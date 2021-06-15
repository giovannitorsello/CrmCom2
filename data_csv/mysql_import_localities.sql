LOAD DATA INFILE '/var/lib/mysql-files/localities.csv'
INTO TABLE localities
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id,countrycode,postalcode,city,adm2,adm2code,adm1,adm1code,latitude,longitude,accuracy)
