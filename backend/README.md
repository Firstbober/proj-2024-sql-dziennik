# Backend

Stack:
- Fastify.js
- Prisma
- SQLite

## Endpointy

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
            "hasło": "mickiewicz"
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa
        - **400** zły login lub hasło

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
            "data": "12.02 - 18.02 2024"
        }
        ```
    - ### Kody
        - **200** zadziałało
        - **500** serwer nie działa

- [POST] `/api/v1/widok/dodaj_lekcje` - 4.png
- [GET] `/api/v1/widok/lekcje/opis` - 5.png
- [GET] `/api/v1/widok/lekcje/oceny` - 6.png
- [GET] `/api/v1/widok/lekcje/frekwencja` - 7.png
- [POST] `/api/v1/widok/lekcje/frekwencja/zmien` - 8.png
- [GET] `/api/v1/widok/wiadomosci` - w.png
- [POST] `/api/v1/widok/wiadomosci/wyslij` - w2.png
