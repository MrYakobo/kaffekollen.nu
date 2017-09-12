# Ideer

---

Postnummer: Skriv in postnummer/stad/by/nånting och lista närmsta städer, listat och ordnat efter distans. Google Maps typ...

EDIT: Ännu bättre: Använd Google Maps API för att autocompletea input (stad, postnummer, whatever) och så listar den förslag på ställen, man väljer ETT av dessa (detta blir ens referenspunkt/hem), sen listas närmsta matställen, man väljer dessa en och en. Sorterade på avstånd till referenspunkten. På detta vis så väljer man inte stad per se, utan snarare sagt enskilda butiker.

---

Senare så skall detta överföras till att backend-skriptet dataminar respektive affär... kul att implementara :)))))

---

Kategori för att välja affär/märke på affären (om man inte gillar Netto eller Ica Maxi, men gillar Hajen i Varberg)

---

Länk till affären/produkten

---

# Datamining
## Coop
Det verkar som att Coop har nationella priser, och "veckans erbjudande" är samma i hela landet. How amazing

## Willys
Willys är lite lustiga. Deras API för att hämta lokala erbjudanden ligger på https://www.willys.se/search/campaigns/offline?avoidCache=1505243684657&page=0&q=2275:categoryLevel2:N1001&size=30&type=PERSONAL_GENERAL, där den intressanta variabeln är `q=2275:categoryLevel2:N1001`. 2275 är butiksnumret, men jag kan inte hitta något sätt att översätta butiksnamn till detta butiksnummer; webbsidan som jag jobbar med för att försöka utvinna detta är https://www.willys.se/erbjudanden/butik. En visning av source ger att "default" storename='Willys Kungsbacka Hede', vilket makes sense eftersom Willys startade där, men något mer konkret hittar jag tyvärr inte i någon av bifogade JS-filer eller AJAX-requests... Men den listan måste ju fyllas på, på något sätt. Detta ter sig mysteriskt.

När (om) jag hittar hur man översätter `sökresultat => butiksnummer` kan jag lätt utvinna erbjudanden på kaffe på en lokal nivå.

EDIT: Man kan söka på Willys, men det är en väldigt konstig och specifik search. Gör fortfarande inget väsen av sig på XHR/JS sidan, så ger ingen information egentligen mer än föregående mining-metod

## Ica
På Ica kan man söka, vilket gör livet enkelt. Detta skall **verkligen** undersökas vidare.