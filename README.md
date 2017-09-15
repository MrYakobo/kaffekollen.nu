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

## Credits
http://kodapan.se/geodata/ för data om Svenska städer
