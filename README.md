# timlineed
Zeitleisteneditor mit 5 Kanälen für LED-Animation (ESP8266 WS2812b) für mein Projekt "silend running": Drohne Dewey.

Erstellt in Javascript mit HTML und CSS.
 
![screenshot_1](https://github.com/polygontwist/timlineed/blob/main/preview01.png)

Es können einzelne Keypunkte gesetzt werden und deren Farbe eingestellt werden.

Klickt man länger auf einen Keypunkt, kann dieser verschoben werden.

Es kann mit dem Mausrad durch die Zeitleiste gescrollt werden. Oder per drag&drop auf der oberen Zeitleiste hin und her gescrollt werden.

Die Dateien mit der Endung .ani enthalten Beispielanimationen (binäres Format).

Der Aufbau ist so:
0x53 ("S") Beginn einer RGB-Sequenz
folgend von der Anzahl (max 255)
folgend Anzahl*3 mit je ein byte für r,g,b 
0x54 ("T") Wie lange in Millisekunden gewartet werden soll
folgend zwei bytes (HI*256+LOW=Millisekunden)
...
0x45 ("E") Schließt die Datei ab

Dies ist Teil eines größeren Projektes (https://www.a-d-k.de/20121216_210832-Lautlos_im_Weltraum_Dewey.htm).
