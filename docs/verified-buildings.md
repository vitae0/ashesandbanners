# Doğrulanmış tarihsel bina envanteri · Ocak 1940

**Kural:** Kaynaksız bina, meydan, park, bütün köyü temsil eden sahte bina ve tarihsel konumu doğrulanamayan yerleşimler oynanabilir değildir. Eski `period-map-data.js` yerleşim kataloğu silindi.

Bu kayıtlar yalnızca **binaların 1940 öncesi varlığının ve ad/adres ilişkisinin kaynakla belgelendiği** anlamına gelir. Referans koordinatları yaklaşık ve güncel coğrafi yer işaretidir. Bunlar **doğrulanmış 1940 kadastro poligonları değildir**. Binanın bir direniş hücresi tarafından gerçekten kullanıldığı iddia edilmez.

| Kent | Kaynaklı bina | Dönem adresi | Tarihsel varlık kaynağı |
|---|---|---|---|
| Warszawa | Teatr Wielki | pl. Teatralny 1/3 | [Kaynak](https://www.warszawa1939.pl/obiekt/teatr-wielki) |
| Warszawa | Pałac Staszica | Nowy Świat 72 | [Kaynak](https://www.warszawa1939.pl/obiekt/palac-staszica) |
| Warszawa | Pałac Saski | pl. Piłsudskiego 3/5/7 | [Kaynak](https://www.warszawa1939.pl/obiekt/palac-saski) |
| Warszawa | Synagoga Nożyków | Twarda 6 | [Kaynak](https://www.warszawa1939.pl/obiekt/grzybowski-synagoga) |
| Warszawa | Kościół św. Anny | Krakowskie Przedmieście 68 | [Kaynak](https://www.warszawa1939.pl/architektura/typ-obiektu) |
| Warszawa | Archikatedra św. Jana | Świętojańska 8 | [Kaynak](https://www.warszawa1939.pl/architektura/typ-obiektu) |
| Warszawa | Muzeum Narodowe | al. 3 Maja 13 | [Kaynak](https://www.warszawa1939.pl/node/97627) |
| Warszawa | Zamek Królewski | pl. Zamkowy | [Kaynak](https://www.warszawa1939.pl/obiekt/zamek-krolewski) |
| Warszawa | Kościół św. Krzyża | Krakowskie Przedmieście 1 | [Kaynak](https://www.warszawa1939.pl/architektura/typ-obiektu) |
| Łódź | Pałac Izraela Poznańskiego | Ogrodowa 15 | [Kaynak](https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki) |
| Łódź | Biała Fabryka Ludwika Geyera | Piotrkowska 282 | [Kaynak](https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki) |
| Łódź | Grand Hotel | Piotrkowska 72 | [Kaynak](https://www.ighp.pl/katalog/szczegoly-obiektu?RecordID=126763) |
| Łódź | Katedra św. Stanisława Kostki | Piotrkowska 265 | [Kaynak](https://lodz-polesie.pttk.pl/wp-content/uploads/2025/01/Regulamin-odznaki-krajoznawczej-Lodz-Ziemia-Obiecana.pdf) |
| Łódź | Pałac Karola Scheiblera | pl. Zwycięstwa 1 | [Kaynak](https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki) |

## Oyun kuralları

- Oynanabilir bölge kimlikleri: `warszawskie`, `lodzkie`.
- Diğer tarihsel bölgeler yalnızca 1939 ülke haritası ve dış savaş simülasyonunun arka planında kalır. Yeni hücre, sığınak veya kurum oluşturulamaz.
- Doğrulanmayan kayıtlar `acquireAsset` tarafından reddedilir. `src/verified-sites.js` beyaz listesindeki `siteId`, bölge ve kurum türü birebir eşleşmelidir.
- Eski v1/v2 kayıtları ve içeriği değiştirilmiş v3 kayıtları açılırken desteklenmeyen binalar ve hücre bölgeleri atılır. Sahte binalar geri getirilmez.
- Köyler ve ilçeler temsilî tek bina olarak sunulmaz. Köy çevresi listeleri tamamen çıkarıldı.
- Gerçek bina sınırı eklemek için tarihsel ölçekte kaynak, jeoreferans dönüşümü ve dijitalleştirilmiş kaynak poligonu gereklidir. Rastgele dikdörtgen, güncel OSM izleri veya nokta etrafında üretilmiş tampon alan kullanılmaz.

## Tarihsel durum ve belirsizlik

Binaların bir bölümünün savaşta ağır hasar gördüğü veya yıkıldığı unutulmamalı. Özellikle Zamek Królewski ve Pałac Saski'nin 1939–1944 arasında değişen fiziksel durumları mevcut prototipte **tarih bazında oynanışa yansıtılmış değildir**; envanter bu yönden tamamlanmış sayılmamalıdır.

Varşova ana katalog: https://www.warszawa1939.pl/architektura/typ-obiektu
Łódź tarihî kültür varlıkları: https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki

