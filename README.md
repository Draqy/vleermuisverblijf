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