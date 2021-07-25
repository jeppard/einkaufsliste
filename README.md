# einkaufsliste
Einkaufsliste fürs 2. Semester Webdev.

## Beschreibung
Dieses Project implementiert eine Plattform um online Einkaufslisten zu verwalten und mit anderen Nutzern zu teilen. Dabei kann man mehrere Listen anlegen und Elemente zu ihnen hinzufügen. 
Auf der Seite für eine Liste kann man Elemente sowohl bearbeiten als auch von der Liste entfernen (Abhaken).
Elemente bestehen aus Artikeln welche persistent bleiben. 
Damit man diese wieder zu einer Liste hinzufügen kann.
Um mehrere Artikel zu Gruppieren gibt es Typen welche ein Artikel besitzt.
Dieser hat eine Farbe und Namen um auf der Listen Seite schnell Identifizierbar zu sein.

## Verwendung
Man kann die Aplikation als yarn-Aplication starten, den Docker Container selber builden oder über docker compose ebenfalls einen gebuildeten Container verwenden.

### 1. Yarn
Yarn installieren:
>npm install --global yarn

Yarn Dependencies fetchen
> yarn

MariaDB installieren und einrichten.
Datenbank für Application erstellen.
In 'etc/database_config.json' (wird beim ersten Start erstellt) Logindaten eingeben

Server starten:
> yarn dev

System startet

### 2. Docker Container 
Docker installieren
Docker Container erschaffen
> docker build -t [container-name] .

Image name in 'docker-compose.yml' in oben verwendeten container-name ändern
Start docker compose
> docker compose up -d

System startet

### 3. Docker Compose
Docker Compose Starten 
> docker compose up -d

System startet

## Seiten
Kurze üvbersicht über die Seiten
| Webseite   | Beschreibung |
|------------|--------------|
| /          | Redirect /login oder /dashboard jenachdem ob man eingelogt ist |
| /dashboard | Zeigt alle Listen mit kurzer Beschreibung a |
| /liste     | Zeigt eine Liste an |
| /login     | Login Page   |
| /register  | Register Page |
| /add*      | Seite zum hinzufügen oder editieren von * (Möglichkeiten: List, Element/Article/Type) |
| /error     | Seite falls ein Fehler passiert |

## Beispieldaten
Es existieren Beispieldaten. Diese stellen eine Minimalgrundlage zur Demonstration der Applikation da.
Die Beispieldaten werden bei Docker compose automatisch verwendet, falls 'START_WITH_EXAMPEL_DATA' auf 'yes' steht. Zum abschalten auf 'no' stellen oder die Zeile entfernen.

Beim Start über yarn muss einmal auf die Seite /init gegangen werden um die Datenbank mit den Beispieldaten zu füllen.

Falls default Daten verwendet werden, existieren Folgende Benutzer mit Folgenden Listen:
| Username | Passwort | Listen |
|----------|----------|--------|
| Maria    | 123      | Owner von 'Mein Einkauf' |
| Peter    | 123      | Owner von 'Wochenkauf' und Member von 'Mein Einkauf' |
| Gunther  | 123      | Member von 'Mein Einkauf' und 'Wochenkauf' |

## Dependencies
Es wurden folgende Sofware verwendet

[Express.js](https://expressjs.com/)

[MariaDB](https://mariadb.org/)

[Yarn](https://yarnpkg.com/)

[Docker](https://www.docker.com/) und [DockerHub](https://hub.docker.com/)

[Bcrypt](https://www.npmjs.com/package/bcrypt)

[RealFaviconGenerator](https://realfavicongenerator.net/)

[TypeScript](https://www.typescriptlang.org/)