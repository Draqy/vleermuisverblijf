# Vleermuis verblijven monitoren dashboard
dit dashboard gebruikt influxDB en grafana voor data visualizatie


# locale installatie

## Instructies
**! belangrijk !** verwijder eerst de timeseries folder voor dat je iets gaat doen

### build
in de folder hoofd folder (vleermuisverblijf)
```bash
docker compose up --build
```

### Stop
in de folder hoofd folder (vleermuisverblijf)
```bash
docker compose down
```

### test
ga naar poort:
 - `80` voor de html pagina's
 - `8080` voor de node js api
 - `8086` voor influxDB

op `http://localhost`


test data voor influxdb:
```
import "csv"
import "influxdata/influxdb"
import "strings"

csvData = "date,description,temp1,temp2,temp3,battery,messages,sw,gw
2024-06-01T00:18:57,MSSL- LA66N711768,17.3,16.8,16.6,3,3108,7,45
2024-06-01T00:38:57,MSSL- LA66N711768,17.2,16.6,16.5,3,3109,7,43
2024-06-01T00:58:56,MSSL- LA66N711768,17.2,16.7,16.3,3,3110,7,43
2024-06-01T01:18:56,MSSL- LA66N711768,17,16.5,16.2,3,3111,7,45"

csv.from(csv: csvData, mode: "raw")
    |> map(fn: (r) => ({
        _measurement: string(v: r.description),
        _time: time(v: "${r.date}Z"),
        Temp1: float(v: r.temp1),
        Temp2: float(v: r.temp2),
        Temp3: float(v: r.temp3),
        Battery: int(v: r.battery),
        Messages: int(v: r.messages),
        Singnal: int(v: r.sw),
        GateWays: int(v: r.gw)
    }))
    |> group(columns: ["_measurement"]) // Ensuring _measurement is part of the group key
    |> influxdb.wideTo(bucket: "bat_data")


```

voor als de tijd waardes nog niet zijn omgezet

        "${strings.replace(i: 1, t: " ", u: "T", v: r.UTC_time)}Z"

### uploaden van test data:

        docker cp .\test_data.csv container_id:/
        docker exec -it container_id influx write --bucket bat_data --file /test_data.csv

### test of data in database staat

        docker exec -it container_id influx v1 shell
        use "bat_data"
        SELECT * FROM "MSSL-LA66N711768"

### link met grafana

1. ga in influx naar `Load Data` > `API Tokens`
2. klik `GENERATE API TOKEN` > `all access API token`
3. geef de token een leuke naam ofzo
4. kopieer token
5. de URL zou er ongeveer zo uit moeten zien `http://localhost:8086/orgs/fd73fa5552157f6c/load-data/tokens`
    kopieer het deel achter `orgs` hier is dat dus `fd73fa5552157f6c`
6. in grafana ga naar `connection` > `Data sources` 
7. `Query language` = Flux
8. `URL` = `http://vleermuisverblijf-timeseries-1:8086`
9. alle `auth` opties uit
10. `Organization` = `fd73fa5552157f6c` (wat uit de url was gekopieerd)
11. `Token` = de gekopieerde token
12. klik `Save & test`

als alles goed is gegaan zou grafana een popup geven met `datasource is working. 3 buckets found`
als grafana dit niet aangeeft is er iets fout

### link met telegraf
cd downloads\project56\telegraf\vleermuis

1. Comment het telegraf gedeelte in docker-compose.yml
2. Run het command in de folder
docker compose up --build
3. Ga naar localhost:8086 en log in met de waardes in docker-compose.yml onder timeseries
4. Ga naar 'Load Data' -> 'Telegraf'. Maak daar een nieuwe connectie en kopieer de toen
5. Zet de token in telegraf.conf bij 'token' onder [[outputs.influxdb_v2]]
6. Zorg dat het telegraf gedeelte niet meer gecomment is in docker-compose.yml
7. Delete de timeseries folder
8. Run het command in de folder
docker compose up --build

# Server installatie

Om op de server te komen doe eerst:
	
	ssh root@136.144.154.20

navigeer dan naar: /home/dashboard/vleermuisverblijf

## utilities commands

`cd` moet je kennen,
`ls` ook (`ls -l` voor extra info)

`cat [file name]` print bestand in terminal <br>
`nano [file name]` edit bestand in terminal <br>
 - `ctrl` + `s` save bestand
 - `crtl` + `x` exit edit



## docker commands

om alle docker containers te zien doe:
	
	docker ps
	
voeg `-a` toe om ook containers te zien die exited zijn


om in een container te komen doe:
	
	docker exec -it {container} ['bash', 'ash', '/bin/bash']
	
`exit` om weer uit de container te komen

om dingen te doen met docker compose doe:

	docker compose

`--help` voor help
