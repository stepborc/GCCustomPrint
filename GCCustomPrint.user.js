// ==UserScript==
// @name           GC Custom Print
// @namespace      http://xxx.xxx.xxx.xxx
// @version        0.85
// @include        https://www.geocaching.com/geocache/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @description    A Custom Print solution for Geocaching.com.
// @copyright      stepborc <sbgithub@gmail.com>
// @downloadURL    http://xxx.xxx.xxx.xxx
// @updateURL      http://xxx.xxx.xxx.xxx
// @grant          none
// ==/UserScript==
//
// Author:         stepborc <sbgithub@gmail.com>
// Changelog:      0.0  - 11.11.2011

//                 0.72 - correct gcSize; add routine for No Attributes
//                 0.73 - remove unnecessary line
//                 0.74 - add Spoiler area to listing
//                 0.75 - Remove small tag from attributes
//                 0.76 - recoding getting Spoiler
//                 0.77 - add cache type icon to title
//                 0.78 - different changes to run with FF
//                 0.79 - few syntax changes, add update and download uri
//                 0.80 - correct hidden date
//                 0.81 - some more gcHidden correction
//                 0.82 - correct include to https
//                 0.83 - correct Owner name and cache size
//                 0.84 - move to NDHome
//                 0.85 - remove older version infos
//Set a link for Custom Print in the Printarea
var lnk = " | <a id='cst_print_link'>Custom Print</a>";
document.getElementById('ctl00_ContentBody_lnkPrintDirectionsSimple').parentNode.innerHTML += lnk;
document.getElementById('cst_print_link').addEventListener("click", cst_print_show, false);
//Get GC-Code
var gccode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
gccode = gccode.trim();
//Get Cache name
var gcname = document.getElementById('ctl00_ContentBody_CacheName').textContent;
gcname = gcname.trim();
//get cache details
var gccachedetails = document.getElementById('cacheDetails').innerText;
gccachedetails = gccachedetails.trim();
//Get gcowner
var gcownerStart = gccachedetails.search(/A cache by/i);
//var gcownerEnd = gccachedetails.search(/HIDDEN/i);
var gcownerEnd = gccachedetails.search(/Message this owner/i);
var gcowner = gccachedetails.substr((gcownerStart + 11),(gcownerEnd-gcownerStart-11));
gcowner = gcowner.trim();
//alert(gcowner);
//Get gcHidden
var gcHidden = "";
//Get gckoord
var gcKoord = "";
//Get Size
var gcSize = "";
//gcsize = gcsize.replace(/Size: /, "");
//gcsize = gcsize.trim();
//Get gcdifficult
var gcdifficult = "";
//Get gcterrain
var gcterrain = "";
//Get short cache description
var shortDesc = "";
//Get long cache description
var longDesc = "";
//Get Hints
//var gchint = document.getElementById('div_hint').innerHTML;
//gchint = rot_13(gchint);
//gchint = gchint.trim();
var gchint = "";
//Get Waypoints
var gcwp = "";
//Get Attributes
var gcAttributes = "";
//Get Spoiler Area
var gcSpoiler = "";
//Get Listing Icon
var gcIcon = '';
//Testarea

function cst_print_show(){
    getAttributes();
    createWPtable();
    getLongDesc();
    getShortDesc();
    getGcTerrain();
    getGcDifficult();
    getGcSize();
    getGcKoord();
    getGcHidden();
    getGcSpoiler();
    getGcIcon();
    getGcHint();
    //declare listing style
    var css = "* { font-family:Arial; color:black; text-align:left; font-size:medium } normal { font-family:Arial; color:black; text-align:left; font-size:medium } headline { font-family:Arial; color:black; font-size:large; font-weight:bold } attributes {font-family:Arial; color:black; font-size:small; font-weight:normal}";
    //Start of listing
    var newPage = "<html><head>" + "<style type=\"text/css\">" + css + "</style>" + " </head><body>";
    //concatenate all atributes to listing
    newPage += '<headline>' + gcIcon + gccode + ': ' + gcname + '</headline><br>';
    newPage += "<b>Owner:</b> " + gcowner + " | <b>seit:</b> " + gcHidden + " | <b>Koord:</b> " + gcKoord + "<br>";
    newPage += "<b>Size:</b> " + gcSize + " | <b>Difficulty:</b> " + gcdifficult + " | <b>Terrain:</b> " + gcterrain + "<br>";
    if (shortDesc.length > 0) {
        newPage += "<normal>" + shortDesc + "</normal><br>";
    }
    newPage += "<normal>" + longDesc + "</normal><br>";
    newPage += "<b>Hints</b><br>" + gchint + "<br>";
    newPage += "<b>Wegpunkte</b><br>" + gcwp +"<br>";
    newPage += "<b>Attribute</b><br><attributes>" + gcAttributes + "</attributes><br>";
    newPage += "<b>Spoiler</b><br>" + gcSpoiler;
    //End of Listing
    newPage += "</body></html>";
    popup=window.open('', '' );
    popup.document.write( newPage );
    popup.focus();
}
function createWPtable(){
    try {
        //var tmpGcwp = document.getElementById('ctl00_ContentBody_Waypoints');
        var anzahlRow = document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr').length;
        gcwp = "";
        gcwp += "<table width=100% border=\"1\">";
        gcwp += "<tr><th>Art</th><th>Hinweis</th><th>Pre</th><th>Post</th><th>Name</th><th>Koord</th></tr>";
        for (var n = 1; n < anzahlRow; n+=2){
            gcwp += "<tr>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[5].innerHTML.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=36%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[(n+1)].childNodes[5].textContent.replace (/^\s+/, '').replace (/\s+$/, '') + "&nbsp;</td>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[7].textContent.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[9].innerHTML.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=30%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[11].textContent.replace('(Parking Area)',' PA').replace(' (Question to Answer)',' QtA').replace('(Stages of a Multicache)','SoM').replace('(Final Location)',' F').trim() + "</td>";
            gcwp += "<td width=25%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[13].textContent.replace (/^\s+/, '').replace (/\s+$/, '').replace('N ','N').replace('E ','E') + "</td>";
            gcwp += "</tr>";
        }
        gcwp += "</table>";
    }catch(err){
        gcwp = "Keine";
    }
}
function rot_13(text) {
    var keycode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var rot13 = new String();
    for ( var i = 0; i < text.length; i++) {
        var codechar = text.substring(i, i + 1);
        var pos = keycode.indexOf(codechar.toUpperCase());
        if (pos >= 0) {
            pos = (pos + keycode.length / 2) % keycode.length;
            codechar = (codechar == codechar.toUpperCase()) ? keycode
            .substring(pos, pos + 1) : keycode.substring(pos, pos + 1)
            .toLowerCase();
            rot13 = rot13 + codechar;
        } else {
            switch (codechar) {
                case "<":
                    if (text.substring(i, i + 4).trim().toUpperCase() == "<BR>" || text.substring(i, i + 4).trim().toUpperCase() == "<BR/>") {
                        rot13 = rot13 + "<BR>";
                        i = i + 3;
                    } else if (text.substring(i, i + 3).toUpperCase() == "<P>") {
                        rot13 = rot13 + "<P>";
                        i = i + 2;
                    } else {
                        rot13 = rot13 + codechar;
                    }
                    break;
                case "&":
                    // Wenn ein &-Zeichen im Text auftaucht, das naechste Semikolon
                    // suchen
                    rot13 = rot13 + codechar;
                    var laenge = 1;
                    while (text.substring(i + laenge, i + 1 + laenge) != ";") {
                        codechar = text.substring(i + laenge, i + 1 + laenge);
                        rot13 = rot13 + codechar;
                        laenge++;
                    }
                    i = i + laenge - 1;
                    break;
                    // Wenn "eckige" Klammer, den Text bis zur
                    // schliessenden Klammer nicht decodieren
                case "[":
                    while (text.substring(i, i + 1) != "]") {
                        rot13 = rot13 + text.substring(i, i + 1);
                        i++;
                    }
                    rot13 = rot13 + "]";
                    break;
                default:
                    rot13 = rot13 + codechar;
                    break;
            }
        }
    }
    if ( rot13.length == 13){
        rot13 += "keine";
    }
    return rot13;
}
function getAttributes(){
    gcAttributes = "";
    var nAttributes = document.getElementById('ctl00_ContentBody_detailWidget').getElementsByTagName('img').length;
    if (nAttributes !== 0){
        for (var i = 0; i < nAttributes; i++){
            if (document.getElementById('ctl00_ContentBody_detailWidget').getElementsByTagName('img')[i].alt != "blank"){
                lv_gcAttribute = '<img src="' +  document.getElementById('ctl00_ContentBody_detailWidget').getElementsByTagName('img')[i].src + '" width="20" height="20">';
                gcAttributes += lv_gcAttribute;
            }
        }
        gcAttributes += "<br>";
        for (var i = 0; i < nAttributes; i++){
            if (document.getElementById('ctl00_ContentBody_detailWidget').getElementsByTagName('img')[i].alt != "blank"){
                gcAttributes += document.getElementById('ctl00_ContentBody_detailWidget').getElementsByTagName('img')[i].alt + ", ";
            }
        }
    }else{
        gcAttributes = '<normal>Keine</normal>';
    }
}
function getLongDesc(){
    longDesc = document.getElementById('ctl00_ContentBody_LongDescription');
    for (var i = 0;i < longDesc.getElementsByTagName('span').length; i++){
        longDesc.getElementsByTagName('span')[i].style.fontFamily = "Arial";
        longDesc.getElementsByTagName('span')[i].style.fontSize = "medium";
        longDesc.getElementsByTagName('span')[i].style.textAlign = "left";
    }
    longDesc = longDesc.innerHTML;
    longDesc = longDesc.trim();
}
function getShortDesc(){
    shortDesc = document.getElementById('ctl00_ContentBody_ShortDescription').innerHTML;
    shortDesc = shortDesc.trim();
}
function getGcTerrain(){
    gcterrain = document.getElementById('ctl00_ContentBody_Localize12').innerHTML;
    gcterrain = gcterrain.trim();
}
function getGcDifficult(){
    gcdifficult = document.getElementById('ctl00_ContentBody_uxLegendScale').innerHTML;
    gcdifficult = gcdifficult.trim();
}
function getGcSize(){
    //gcSize = document.getElementsByTagName("img")[8].alt;
    gcSize = document.getElementById('ctl00_ContentBody_size');
    //alert(gcSize);
    gcSize = gcSize.getElementsByTagName("img")[0].alt;
    //alert(gcSize);
    gcSize = gcSize.replace(/Size: /, "");
    gcSize = gcSize.trim();
}
function getGcKoord(){
    gcKoord = document.getElementById('uxLatLon').innerHTML;
    gcKoord = gcKoord.trim();
    gcKoord = gcKoord.replace('N ', 'N');
    gcKoord = gcKoord.replace('E ', 'E');
}
function getGcHidden(){
    gcHidden = document.getElementById('ctl00_ContentBody_mcd2');
    gcHidden = gcHidden.innerHTML;

    var gcHiddenLength = gcHidden.length;
    var gcHiddenDate = gcHidden.substr(gcHiddenLength - 60, 22);
    var gcHiddenYear = gcHiddenDate.substr(18,16);
    var gcHiddenMonth = gcHiddenDate.substr(10,4);
    var gcHiddenDay = gcHiddenDate.substr(15,2);
    gcHidden = gcHiddenDay + "." + gcHiddenMonth.trim() + "." + gcHiddenYear;
}
function getGcSpoiler(){
    gcSpoiler = "";
    var nUl = document.getElementsByTagName('ul').length;
    for (var i = 0;i<nUl;i++){
        gcSpoilerAttribute = document.getElementsByTagName('ul')[i].getAttribute('class');
        if (gcSpoilerAttribute == 'CachePageImages NoPrint'){
            var lvGcSpoiler = document.getElementsByTagName('ul')[i];
            nGcSpoiler = lvGcSpoiler.getElementsByTagName('li').length;
            if (nGcSpoiler !== 0){
            for (var j = 0;j<nGcSpoiler;j++){
                lvHref = lvGcSpoiler.getElementsByTagName('li')[j].getElementsByTagName('a');
                lvHref = '<img src="' + lvHref[0].getAttribute('href',0) +'"><br>' + lvGcSpoiler.getElementsByTagName('li')[j].innerHTML + '<br>';
                gcSpoiler += lvHref;
            }
            }else{
                gcSpoiler = "Keiner";
            }
            break;
        }
    }

}

function getGcIcon(){
    var lvGcIcon = document.getElementById('cacheDetails');
    gcIcon = lvGcIcon.getElementsByTagName('img')[0];
    gcIcon = '<img src="' + gcIcon.getAttribute('src') + '" width="20" height="20">';
}

function getGcHint(){
    gchint = document.getElementById('div_hint').innerHTML;
    gchint = rot_13(gchint);
    gchint = gchint.trim();
}
