# Vleermuis verblijven monitoren dashboard
dit dashboard gebruikt influxDB en grafana voor data visualizatie

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