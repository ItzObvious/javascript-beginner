"use strict";

/*
    Veröffentlichungsdatum
*/
var pubdate = new Date("1915-10-01"),
	// Alter des Texts in Millisekunden:
	datediff = Date.now() - pubdate.getTime(),
	years,
	days,
	months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

datediff /= (1000 * 60 * 60 * 24); // Alter in Tagen
datediff = Math.floor(datediff);
// Umrechnung in Jahre + Tage
years = Math.floor(datediff / 365.2425);
days = Math.round(datediff % 365.2425);
// Ausgabe des Textalters:
document.write("<p>Dieser Text wurde am " + pubdate.getDate() + ". " + months[pubdate.getMonth()] + ' ' + pubdate.getFullYear() + " veröffentlicht, also vor <b>" + (years? years + " Jahren und " : "") + days + " Tagen</b>.</p>");

/*
    Längste und häufigste Wörter
*/
var text = document.querySelector('article').innerHTML, // Text
	words = text.split(/[.,;!?»«"'\s–]+/), // alle Wörter
	longestWord = '',	// längstes Wort
	wordLengths = [], // alle Wortlängen
	wordsLengthTotal = 0,	// Summe der Wortlängen (für Durchschnitt)
	wordUnique = {}, // unterschiedliche Wörter mit Häufigkeiten
	usedOnce = [], // Liste einmalig verwendeter Wörter
	wordSort = [], // nach Häufigkeit sortierte Wortliste
	randoms = []; // Für Ausgabe zufälliger Wörter

// Sortieralgorithmus für Zahlen
var numsort = function(a, b) {
	return a - b;
}

// Ermittelt Durchschnittswert
var average = function(sum, number) {
	var av = sum / number;
	av = av.toFixed(1); // rundet auf eine Kommastelle
	av = av.replace('.', ','); // deutsches Komma
	return av;
}

// Ermittelt Median
var median = function(values) {
	// numerische Sortierung mit numsort
	values.sort(numsort);
	if (values.length % 2) {
		// ungerade Anzahl: Median = mittlerer Wert
		return values[(values.length - 1) / 2];
	} else {
		// gerade Anzahl: Median = Durchschnitt zweier Werte
		var tmp = values[values.length / 2 - 1] + values[values.length / 2];
		return average(tmp, 2);
	}
}

// Konstruktor für Wort-Objekte
var Word = function(word) {
	var _occurrences = []; // privates Array
	// definiert drei Eigenschaften und eine Methode
	// writable und configurable sind per Default false
	Object.defineProperties(this, {
		"word": {
			enumerable: true, // erscheint in for ... in
			get: function() { // Getter
				return word;
			}
		},
		"occurrences": {
			enumerable: true,
			get: function() {
				return _occurrences.slice(); // Kopie des privaten Arrays
			}
		},
		"count": {
			enumerable: true,
			get: function() {
				return _occurrences.length;
			}
		},
		"addOccurence": {
			enumerable: true,
			value: function(occ) {
				_occurrences.push(occ + 1); // Zählung beginnt bei 1
			}
		}
	});
	wordSort.push(this); // Array für spätere Sortierung
}

// Prototyp für Wort-Objekte
Word.prototype = {
	constructor: Word, // erhält die Referenz auf Word()
	sprache: "deutsch",
	get occurrencesString() { // Getter: Ausgabe aller Wortvorkommen
		if (this.occurrences.length < 6)
			return this.occurrences.join(', ');
		else { // mehr als 5 Fundstellen: Liste abkürzen
			var temp = '';
			for (var i = 0; i < 3; i++) // 3 Einträge ausgeben
				temp += this.occurrences[i] + ', ';
			temp += '[' + (this.occurrences.length - 4) + ' weitere ...], '; // Anzahl der ausgelassenen Einträge
			temp += this.occurrences[this.occurrences.length - 1]; // letzter Eintrag
			return temp;
		}
	}
};

// Durchläuft alle Elemente des Arrays
// forEach mit Callback als Alternative zu for (...)
words.forEach(function(word, i) {
	// überspringt Wörter ohne Länge (passiert beim Einlesen):
	if (!word.length) return; // bei for-Schleife: continue
	wordLengths.push(word.length); // für Median-Berechnung
	wordsLengthTotal += word.length;
	if (word.length > longestWord.length)
		longestWord = word;
	var lcWord = word.toLowerCase(); // Kleinschreibung
	// legt Word-Objekt an und referenziert es in Objekt wordUnique:
	if (wordUnique[lcWord] === undefined) wordUnique[lcWord] = new Word(lcWord);
	wordUnique[lcWord].addOccurence(i); // erfasst das Vorkommen
});

// Textlänge, längstes Wort, Wortanzahl, Durchschnittslänge
document.write('<p>Er hat eine Länge von <b>' + text.length + ' Zeichen</b>.</p>');
document.write('<p>Das mit <b>' + longestWord.length + ' Zeichen</b> längste Wort lautet <b><q>' + longestWord + '</q></b>. Die durchschnittliche Länge der insgesamt <b>' + words.length + ' Wörter</b> beträgt <b>' + average(wordsLengthTotal, words.length) + ' Zeichen</b>; der Median-Wert liegt bei <b>' + median(wordLengths) + ' Zeichen</b>.</p>');

// Einmalig genutzte Wörter finden
for (var key in wordUnique) {
	if (wordUnique[key].count === 1) usedOnce.push(key);
}

// Anzahl unterschiedlicher und einmaliger Wörter
document.write('<p>Der Text enthält <b>' + wordSort.length + ' unterschiedliche Wörter</b>; jedes Wort kommt also durchschnittlich ' + average(words.length, wordSort.length) + ' Mal vor. <b>' + usedOnce.length + ' Wörter</b> tauchen nur einmal im Text auf, darunter:</p><ol>');

// Gibt zufällig ausgewählte Wörter von usedOnce aus
while (randoms.length < 5) {
	// Bricht ab, wenn usedOnce zu klein ist
	if (randoms.length == usedOnce.length) break;
	// Zufälliger Array-Index
	var random = Math.floor(Math.random() * usedOnce.length);
	// Prüft, ob dieser Index bereits verwendet wurde
	if (randoms.indexOf(random) == -1) {
		document.write('<li><q>' + usedOnce[random] + '</q> <small>(Wort ' + wordUnique[usedOnce[random]].occurrences[0] + ')</small></li>');
		randoms.push(random);
	}
}
document.write('</ol>');

// Wörter nach Häufigkeit sortieren
wordSort.sort(function(a, b) {
	return b.count - a.count;
});

// Gibt die häufigsten Wörter aus
document.write('<p>Die häufigsten Wörter im Text und ihre Anzahl:</p><ol>');
for (var i = 0; i < 50; i++) {
	document.write('<li><q>' + wordSort[i].word + '</q> <small>(' + wordSort[i].count + ' Vorkommen: Wort ' + wordUnique[wordSort[i].word].occurrencesString + ')</small></li>');
}
document.write('</ol>');

/*
    Anklickbare Wörter
*/
var clickable = document.querySelectorAll('q'); // alle <q>s
for (var i = 0; i < clickable.length; i++) {
	// title-Element mit Hinweistext
	clickable[i].title = wordUnique[clickable[i].innerHTML].count + ' Vorkommen von "' + clickable[i].innerHTML + '" hervorheben';
	// fügt click-Ereignis hinzu
	clickable[i].addEventListener("click", function(e) {
		// formatiert geklicktes <q> (e.target) fett, alle anderen normal
		for (var j = 0; j < clickable.length; j++) {
			clickable[j].style.fontWeight = (clickable[j] == e.target)? 'bold' : 'normal';
		}
		var clickedWord = e.target.innerHTML;
		console.info('Suche nach: ' + clickedWord);
		// regulärer Ausdruck mit Variable für die Suche
		var search = new RegExp('\\b(' + clickedWord + ')\\b', 'gi');
		// ersetzen und ins Dokument einfügen
		document.querySelector('article').innerHTML = text.replace(search, '<b>$1</b>');
	});
}
