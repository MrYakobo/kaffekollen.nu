# Kaffekollen.nu - jämför kaffepriser på ett sexigt sätt

Kaffekollen.nu är en webbapp som är till för att göra det enklare att hitta lokala kaffepriser i din hemstad.

Input:
    Postnummer, array (för att kunna ha flera städer man kollar på)
    Kaffemärke, array
    Sort på kaffet, om det är kapslar/bryggkaffe/kokkaffe

Backend:

- En JS-fil för varje affär, en "modul" om man så vill kalla det.
    + Input: Postnummer
    + Return: Array av objekt med följande innehåll:

        name
        weight
        price
        img: {
            full
            preview
        },
        brand
        compareprice
        eco
        type
        coffeinfree
        promo?: {
            amount
            weight
            compareprice
            price
            savings
            label
        }


name, brand och type måste standariseras på något sätt, så de presenteras likadant i sökfält och dylikt.

## Todo
ICA har en helt egen sida för butikens specialpriser. Indexera baserat på dessa.

Hitta någon modul som mha postnummer kan spotta ut närmaste städer på en viss radie, specificerad av användaren...
Denna används på respektive matkedjas hemsida för att hitta stadens olika butiker, där erbjudanden visas.

För ICA:

    var stad = citify(postnummer)

    https://www.ica.se/butiker/${stad}/ > for(link in storeLinks){
        var erbjudanden = link.replace('/start','/erbjudanden')
        x(erbjudanden, (body)=>{
            //hantera samtliga resultat, sök efter "kaffe"
        })
    }

Om inga erbjudanden på kaffe hittas, visa ordinarie databas (gäller över alla butiker (tror jag))