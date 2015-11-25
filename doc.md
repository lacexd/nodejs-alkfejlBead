# Alkalmazások fejlesztése dokumentáció

## Követelményanalízis
1. Követelmények összegyűjtése
	1. Funkcionális elvárások:
		* A felhasználok tudják feljegyezni hogy melyik napon mettől meddig dolgoztak.
		* 
		* A felhasználók tudjanak hozzáadni League of Legends meccseket
		* Van lehetőségük ezek módosítására is
		* Csak az adminisztrátor tud meccseket törölni
		* Csak felhasználóknak illetve adminisztrátoroknak legyen lehetősége a hozzáadott meccsek megtekintésére
		* Lehetősg a győztes megjelölése
	2. Nem funkcionális elvárások:
		* Biztonság
		* Jelszavak tárolása titkosítva
		* Felhasználó barát design
2. Használatieset-modell
	1. Szerepkörök
		* adminisztrátorok: meccsek törlése
		* userek: meccsek hozzáadása, módosítása, győztes megjelölése 
	2. Használati diagramm
	
	![Használati diagramm](docs/images/im01.png)

	3. Folyamatok menete:
		- meccs hozzáadása:
			- bejelentkezés
			- "add" menüpontra kattintva betölt a form
			- az összes mező kitöltése után hozzáadhatóval válik a meccs
			- értelemszerűen a "save" gombra kattintva elmentjük a meccset
		
		![folyamat01](docs/images/alk_fejl_image_02.png)

## Tervezés
1. Architektúra terv
	1. Oldaltérkép
		* Publikus
			* Főoldal
			* Bejelentkezés
			* Regisztráció
		* Felhasználó
			* Főoldal
			* Be/Kijelentkezés
			* Meccsek listázása
				* Egy adott játék megtekintése
				* A meccs szerkesztése
		* Adminisztrátor
			* Főoldal
			* Be/Kijelentkezés
			* Meccsek listázása
				* Egy adott játék megtekintése
				* A meccs szerkesztése
				* Meccs törlése
	2. Végpontok
		* GET /:főoldal
		* GET /login/login: bejelentkező oldal
		* GET /login/signup: regisztrációs oldal
		* POST /login/login: bejelentkezési adatok elküldése
		* POST /login/signup: regisztrációs adatok elküldése
		* GET/POST /login/logout: logout
		* GET /add: meccs hozzáadása
		* POST /add: meccs adatok elküldése
		* GET /list: meccsek listázása
		* GET /delete/:id : meccs törlése
		* GET /ready/:id : meccs jóváhagyása
		* GET /edit/:id : meccs módosítása
		* POST /edit/:id : módosított adatok elküldése
		* GET /game/:id : meccs megjelenítése
2. Felhasználóifelület-modell
	1. Designterv
	
		![designterv](docs/images/alk_fejl_image_06.png)

3. Osztálymodell
	1. Adatmodell

		![adatmodell](docs/images/alk_fejl_image_04.png)

	2. Adatbázisterv

		![adatbazisterv](docs/images/alk_fejl_image_05.png)

## Implementáció
1. Fejlesztői környezet bemutatása
	Az implementáció c9 ideben történt.
2. Könyvtárstruktúrában lévő mappák funkiójának bemutatása
```
─first_own_workspace    ROOT
 ├───models             modellek
 ├───test				teztek
 └───views              hbs
	 ├───login          ki/bejelentkezés megjelenés
	 └───partials       navigációs panel
```
	
## Tesztelés
1. Tesztelés bemutatása
	Az egység teszteket a mocha valamint chai modulok segítségével
2. Egszégtesztek
	Az adatmodell tesztelését végzik el
	A tesztek 'mocha ./test/tests.js' commanddal futtathatóak és a user modell tesztelését végzik

## Felhasználói dokumentáció
1. System requirements: linux os, npm package manager
2. Futtatás
	- clone githubról
	- telepítés npm paranccsal
	- futtatás: nodemon index.js
3. Használati utasitások
	- regisztráció
	- login
	- meccsek hozzáadása
	- adminisztrátorok: meccsek törlése
	- meccsek listázása