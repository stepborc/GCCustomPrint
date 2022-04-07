// ==UserScript==
// @name           GC Custom Print
// @namespace      http://xxx.xxx.xxx.xxx
// @version        0.98
// @include        https://www.geocaching.com/geocache/*
// @description    A custom print solution for geocaching.com.
// @copyright      stepborc <sbgithub@gmail.com>
// @downloadURL    https://github.com/stepborc/GCCustomPrint/raw/master/GCCustomPrint.user.js
// @updateURL      https://github.com/stepborc/GCCustomPrint/raw/master/GCCustomPrint.user.js
// @grant          none
// ==/UserScript==
// Author:         stepborc <sbgithub@gmail.com>
//Set a link for Custom Print in the Printarea
let lnk = " | <a id='cst_print_link'>Custom Print</a>";
document.getElementById('ctl00_ContentBody_lnkPrintDirectionsSimple').parentNode.innerHTML += lnk;
document.getElementById('cst_print_link').addEventListener("click", cst_print_show, false);
//Get GC-Code
let gccode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
gccode = gccode.trim();
//Get Cache name
let gcname = document.getElementById('ctl00_ContentBody_CacheName').textContent;
gcname = gcname.trim();
//get cache details
//let gccachedetails = document.getElementById('cacheDetails').innerText;
let gccachedetails = document.getElementById('ctl00_ContentBody_mcd1').innerText;
gccachedetails = gccachedetails.trim();
//Get gcowner
let gcownerStart = gccachedetails.search(/A cache by/i);
let gcownerEnd = ''
if (document.getElementsByClassName("ctoc_link").length === 0){
    gcownerEnd = gccachedetails.search(/Message this owner/i);
    //gcownerEnd = gccachedetails.search(/A cache by /i);

} else {
    gcownerEnd = gccachedetails.search(/HIDDEN/i);
    //gcownerEnd = gccachedetails.search(/Message this owner/i);
}
let gcowner = gccachedetails.substring((gcownerStart + 11),(gccachedetails.length-20));
//gcowner = gcowner.trim();
//alert(gcowner);
//Get gcHidden
let gcHidden = "";
//Get gckoord
let gcKoord = "";
//Get Size
let gcSize = "";
//gcsize = gcsize.replace(/Size: /, "");
//gcsize = gcsize.trim();
//Get gcdifficult
let gcdifficult = "";
//Get gcterrain
let gcterrain = "";
//Get short cache description
let shortDesc = "";
//Get long cache description
let longDesc = "";
//Get Hints
//var gchint = document.getElementById('div_hint').innerHTML;
//gchint = rot_13(gchint);
//gchint = gchint.trim();
//let gchint = "";
//Get Waypoints
let gcwp = "";
//Get Attributes
let gcAttributes = "";
//Get Spoiler Area
let gcSpoiler = "";
//Get Listing Icon
let gcIcon = '';
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
    let gchint = getGcHint();
    //declare listing style
    var css = "* { font-family:Arial; color:black; text-align:left; font-size:medium } normal { font-family:Arial; color:black; text-align:left; font-size:medium } headline { font-family:Arial; color:black; font-size:large; font-weight:bold } attributes {font-family:Arial; color:black; font-size:small; font-weight:normal}";
    //Start of listing
    var newPage = "<html><head>" + "<style type=\"text/css\">" + css + "</style>" + " </head><body>";
    //concatenate all atributes to listing
    newPage += "<headline>" + gcIcon + gccode + ": " + gcname + "</headline><br>";
    newPage += "<b>Owner:</b> " + gcowner + " | <b>seit:</b> " + gcHidden + " | <b>Koord:</b> " + gcKoord + "<br>";
    newPage += "<b>Size:</b> " + gcSize + " | <b>Difficulty:</b> " + gcdifficult + " | <b>Terrain:</b> " + gcterrain + "<br>";
    if (shortDesc.length > 0) {
        newPage += "<normal>" + shortDesc + "</normal><br>";
    }
    newPage += "<normal>" + longDesc + "</normal><br>";
    newPage += "<b>Hints</b><br>" + gchint + "<br>";
    newPage += "<b>Wegpunkte</b><br>" + gcwp;
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
        //var anzahlRow = document.getElementById('ctl00_ContentBody_WaypointsInfo').getElementsByTagName('tr').length;
        gcwp = "";
        gcwp += "<table width=100% border=\"1\">";
        gcwp += "<tr><th>Art</th><th>Hinweis</th><th>Pre</th><th>Post</th><th>Name</th><th>Koord</th></tr>";
        for (var n = 1; n < anzahlRow; n+=2){
            //alert(n);
            gcwp += "<tr>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[3].innerHTML.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=36%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[(n+1)].childNodes[5].textContent.replace (/^\s+/, '').replace (/\s+$/, '') + "&nbsp;</td>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[5].textContent.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=3%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[7].innerHTML.replace (/^\s+/, '').replace (/\s+$/, '') + "</td>";
            gcwp += "<td width=30%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[9].textContent.replace('(Parking Area)',' PA').replace(' (Question to Answer)',' QtA').replace('(Stages of a Multicache)','SoM').replace('(Final Location)',' F').trim() + "</td>";
            gcwp += "<td width=25%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[11].textContent.replace (/^\s+/, '').replace (/\s+$/, '').replace('N ','N').replace('E ','E') + "</td>";
            gcwp += "</tr>";
        }
        gcwp += "</table>";
    }catch(err){
        gcwp = "Keine<br>";
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
    //return text;
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
    var gcHiddenDate = gcHidden.substr(gcHiddenLength - 70, 11);
    var gcHiddenYear = gcHiddenDate.substr(7,4);
    var gcHiddenDay = gcHiddenDate.substr(4,2);
    var gcHiddenMonth = gcHiddenDate.substr(1,2);
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
    let iconType = '';
    switch(iconTypeName){
        case 'Traditional Geocache':
            iconType = 'icon-2';
            break;
        case 'Mystery Cache':
            iconType = 'icon-8';
            break;
        case 'Multi-cache':
            iconType = 'icon-3';
            break;
        case 'Earthcache':
            iconType = 'icon-137';
            break;
        case 'Letterbox Hybrid':
            iconType = 'icon-5';
            break;
        case 'Event Cache':
            iconType = 'icon-6';
            break;
        case 'Cache In Trash Out Event (CITO)':
            iconType = 'icon-13';
            break;
        case 'Mega-Event Cache':
            iconType = 'icon-453';
            break;
        case 'Giga-Event Cache':
            iconType = 'icon-7005';
            break;
        case 'Wherigo Cache':
            iconType = 'icon-1858';
            break;
        //case 'Letterbox Hybrid':
        //    iconType = 'icon-5';
        //    break;
        //case 'Letterbox Hybrid':
        //    iconType = 'icon-5';
        //    break;
        //case 'Letterbox Hybrid':
        //    iconType = 'icon-5';
        //    break;

    }
    gcIcon = '<svg class="icon cache-icon" role="presentation" width="20" height="20"><use xlink:href="';
    gcIcon = gcIcon + '/app/ui-icons/sprites/cache-types.svg#';
    gcIcon = gcIcon + iconType;
    gcIcon = gcIcon + '"></use></svg>';
}

function getGcHint(){
    let gchint = document.getElementById('div_hint').innerHTML;
    gchint = gchint.trim();
    while (gchint.endsWith("<br>")){
        gchint = gchint.substring(0,(gchint.length-4));
        gchint = gchint.trim();
    }
    //check if gc little helper is active
    if (document.getElementsByClassName("ctoc_link").length === 0){
        gchint = rot_13(gchint);
    }
    //gchint = gchint.trim();
    return gchint;
}
