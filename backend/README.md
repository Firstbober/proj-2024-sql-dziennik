# Backend

Stack:
- Fastify.js
- Prisma
- SQLite

## Jak uruchomić

- `export NODE_TLS_REJECT_UNAUTHORIZED=0` - ose :)

- `npm i`

Dev:
- `npm run watch`
- `npm run dev`

Prod:
- `npm run build`
- `npm run start`

## Endpointy
Każdy musi mieć header z `content-type`: `'application/json'`

Każdy endpoint może zwrócić:
```json
{
    "statusCode": 000,
    "error": "",
    "message": ""
}
```
Każdy endpoint, poza login, może zwrócić 401 gdy
nie ma tokenu.


- [POST] `/api/v1/login` 1.png
    - ### Zwraca
        ```json 
        {
            "token": "1234567889",
        }
        ```
    - ### Potrzebuje
        ```json
        {
            "login": "adam",
            "haslo": "mickiewicz"
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa
        - **400** zły login lub hasło

Każdy endpoint potrzebuje header `Authorization`: `Token XXXX`

- [GET] `/api/v1/widok/glowny` - 2.png
    - ### Zwraca
        ```json 
        {
            "godzina": "12:05",
            "data": "16 lutego 2024",
            "ilosc_wiadomosci": 16,
            "do_zmiany_hasla_zostalo": 23,
            "wersja_dziennika": "0.0.0.1 alpha"
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [GET] `/api/v1/widok/lekcje` - 3.png
    - ### Zwraca
        ```json 
        {
            "data": "12.02 - 18.02 2024",
            "dni": [
                {
                    "data": "12.02.2024",
                    "dzien": "poniedziałek",
                    "lekcje": [
                        {
                            "id": 0,
                            "godzina": 0,
                            "grupa": "4 TiP",
                            "przedmiot": "Praktyka Zawodowa",
                            "nauczyciel": "Adam Mickiewicz"
                        }
                    ]
                }
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [POST] `/api/v1/widok/dodaj_lekcje` - 4.png
    - ### Potrzebuje
        ```json
        {
            "nauczyciel": "Adam Mickiewicz",
            "godzina": 0,
            "grupa": "",
            "przedmiot": "",
            "temat": "",
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **400** coś nie wypełnione
        - **409** juz cos jest
        - **500** serwer nie działa

- [GET] `/api/v1/widok/lekcje/:id/opis` - 5.png
    - ### Zwraca
        ```json 
        {
            "nauczyciel": "Adam Mickiewicz",
            "zastępstwo": false,
            "nauczyciel_wspomagajacy": null,
            "zastepstwo_nau_wspom": false,
            "nauczyciel_wspomagajacy_2": null,
            "zastepstwo_nau_wspom_2": false,
            "grupa": "4 TiP",
            "przedmiot": "Praktyka Zawodowa",
            "temat": "ABCD",
            "kolejny_nr_tematu": 80
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **404** nie ma
        - **500** serwer nie działa

- [GET] `/api/v1/widok/lekcje/:id/oceny` - 6.png
    - ### Zwraca
        ```json 
        {
            "okres_klasyfikacyjny": 2,
            "grupa_kolumn": "moje",
            "pokaz_uczniow": "Wszystkich",
            "przedmiot": "Praktyka zawodowa",
            "uczniowe": [
                {
                    "id": 2,
                    "imie_nazwisko": "Jan Góra",
                    "oceny": [4, 5],
                    "srednia": 4.5
                }
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [GET] `/api/v1/widok/lekcje/:id/frekwencja` - 7.png
    - ### Zwraca
        ```json 
        {
            "uczniowie": [
                {
                    "id": 2,
                    "imie_nazwisko": "Jan Góra",
                    "frekwencja": ["b", "o", "o", "o",
                    "o", "o", "o", "o", "o", "n", "?", "b",
                    "b", "b"]
                }
            ],
            "obecnych": [0]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [POST] `/api/v1/widok/lekcje/:id/frekwencja/zmien` - 8.png
    - ### Potrzebuje
        ```json 
        {
            "uczniowie": [
                {
                    "id": 2,
                    "frekwencja": "o"
                }
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [GET] `/api/v1/wiadomosci` - w.png
    - ### Zwraca
        ```json 
        {
            "wiadomosci": [
                {
                    "id": 0,
                    "nadawca": "Wladylaw Bomczyk",
                    "temat": "Big T",
                    "zalacznik": null,
                    "otrzymano": "15.02.2024 08:52:10",
                    "skrzynka": "Adam Mickiewicz",
                    "przeczytano": false
                }
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [GET] `/api/v1/wiadomosci/lista_adresatow` - w.png
    - ### Zwraca
        ```json 
        {
            "adresaci": [
                ["Wladylaw Bomczyk", 1],
                ["Jan Góra", 2]
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [GET] `/api/v1/wiadomosci/:id` - w.png
    - ### Zwraca
        ```json 
        {
            "wiadomosci": [
                {
                    "id": 0,
                    "nadawca": "Wladylaw Bomczyk",
                    "temat": "Big T",
                    "zalacznik": null,
                    "otrzymano": "15.02.2024 08:52:10",
                    "skrzynka": "Adam Mickiewicz",
                    "tresc": "uwaga, big T na rejonie"
                }
            ]
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [POST] `/api/v1/wiadomosci/wyslij` - w2.png
    - ### Potrzebuje
        ```json 
        {
            "odbiorca": 1,
            "temat": "Re: Big T",
            "tresc": "rozumiem"
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa
