# Ideer

---

Postnummer: Skriv in postnummer/stad/by/nånting och lista närmsta städer, listat och ordnat efter distans. Google Maps typ...

EDIT: Ännu bättre: Använd Google Maps API för att autocompletea input (stad, postnummer, whatever) och så listar den förslag på ställen, man väljer ETT av dessa (detta blir ens referenspunkt/hem), sen listas närmsta matställen, man väljer dessa en och en. Sorterade på avstånd till referenspunkten. På detta vis så väljer man inte stad per se, utan snarare sagt enskilda butiker.

EDIT2: Använd information om svenska städer ifrån en betrodd databas. I det här fallet, från http://kodapan.se/geodata/. Att välja enskilda butiker ska man dock kunna göra.

---

Kategori för att välja affär/märke på affären (om man inte gillar Netto eller Ica Maxi, men gillar Hajen i Varberg)

EDIT: Om man får välja varje enskild butik för sig så löser sig allt sånt här. Kanske ska man ha ett "välj alla inom radie X"-alternativ (smidigt om man bor i storstad och det finns hundra miljoner affärer att välja mellan)

---

Länk till affären/produkten

---

# Datamining
## Coop
Det verkar som att Coop har nationella priser, och "veckans erbjudande" är samma i hela landet. How amazing, detta gör att jag inte behöver jaga stadspriser överallt.

## Willys
Willys är lite lustiga. Deras API för att hämta lokala erbjudanden ligger på https://www.willys.se/search/campaigns/offline?avoidCache=1505243684657&page=0&q=2275:categoryLevel2:N1001&size=30&type=PERSONAL_GENERAL, där den intressanta variabeln är `q=2275:categoryLevel2:N1001`. 2275 är butiksnumret, men jag kan inte hitta något sätt att översätta butiksnamn till detta butiksnummer; webbsidan som jag jobbar med för att försöka utvinna detta är https://www.willys.se/erbjudanden/butik. En visning av source ger att "default" storename='Willys Kungsbacka Hede', vilket makes sense eftersom Willys startade där, men något mer konkret hittar jag tyvärr inte i någon av bifogade JS-filer eller AJAX-requests... Men den listan måste ju fyllas på, på något sätt. Detta ter sig mysteriskt.

När (om) jag hittar hur man översätter `sökresultat => butiksnummer` kan jag lätt utvinna erbjudanden på kaffe på en lokal nivå.

EDIT: Man kan söka på Willys, men det är en väldigt konstig och specifik search. Gör fortfarande inget väsen av sig på XHR/JS sidan, så ger ingen information egentligen mer än föregående mining-metod

## Ica
Ica returnerar mycket vettiga resultat från sin search-engine. Detta gör att man kan enkelt hitta rätt affär och veckans erbjudanen via en JSON-fil med alla ICA-butiker i. Dessutom har Ica inga som helst "nationella" priser! Dock så svårar de till det genom att rendera på server side, vilket gör det jobbigare att komma åt informationen och *risk finns* att det scapas fel information... :/

## SPA

Kolla upp Vuex, behövs iallafall något för att kunna synkronisera `query.cities` i app.vue och `chosenCities` i mapsquery.
EDIT: Löste problemet genom att låta städerna vara "readonly" i app.vue.

Använda Vue-router? Intressant?


## Projektering:
Hittils så har willys.js och coop.js bara fetchat allmän information om kaffe, utan att ta till hänsyn lokala erbjudanden. Man behöver båda delarna, och jag tänker mig att man kan lägga samtlig information i lokala tabeller. Dessa skapas efter behov... tror jag. Så att om någon söker på Örgryte för första gången så utförs:

Fetcha alla butiker i "Örgryte" från alla butiker, finns inte den affären på den platsen så fortsätt --> Sätt in i en ny tabell "local.${city}.${storename}", och om "local.${city}" ("parent table" som man kan göra querys på) inte redan finns, skapa den.

Alltså måste jag ändra willys.js så att den har en "generell" hämta-funktion. Coop behöver inte det iom att den är redan generell.

Jag kommer också att behöva en "expire"-kolumn i databasen... självklart så skall erbjudanden som tog slut igår inte visas, men folk kan behöva veta när erbjudandet slutar. Ange denna i relativ tid (på söndag, nästa torsdag osv.) samt visa datum.


# Maintainance

Kaffekollen har ett par filer som ska uppdateras regelbundet (varje vecka)

- Erbjudanden från respektive (eftersökta) butik

Och saker som behöver pollas en gång i veckan: 

- Butiker i landet. Detta skall göras genom `${affär}.updateStores()`, och alla kan uppdateras med `stores.updateStores()`