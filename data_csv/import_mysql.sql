LOAD DATA INFILE '/var/lib/mysql-files/AGCOM_BBmap_copertura_adsl_100m_csv.csv'
INTO TABLE internetServiceLevels
FIELDS TERMINATED BY ';'
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 4 ROWS
(@var1,@var2,gridId100m,nAdress,speedDown,speedUp,coverage)
SET xCoord=CAST(SUBSTR(@var1,1,7) AS DECIMAL),yCoord=CAST(SUBSTR(@var2,1,7) AS DECIMAL);