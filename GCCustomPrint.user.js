// ==UserScript==
// @name           GC Custom Print
// @namespace      http://xxx.xxx.xxx.xxx
// @version        0.114
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

//solve github probelem
//https://wiki.archlinux.org/title/Xinit#xinitrc

//Get gckoord
let gcKoord = "";

//Get gcdifficult
let gcdifficult = "";
//Get gcterrain
let gcterrain = "";
//Get short cache description
let shortDesc = "";
//Get long cache description
let longDesc = "";
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
    let gcOwner = getGcOwner();
    let gcCode = getGcCode();
    let gcName = getGcName();
    let gcHidden = getGcHidden();
    let gchint = getGcHint();
    let gcSize = getGcSize();
    getAttributes();
    createWPtable();
    getLongDesc();
    getShortDesc();
    getGcTerrain();
    getGcDifficult();
  
    getGcKoord();
    
    getGcSpoiler();
    getGcIcon();
    
    //declare listing style
    var css = "* { font-family:Arial; color:black; text-align:left; font-size:medium } normal { font-family:Arial; color:black; text-align:left; font-size:medium } headline { font-family:Arial; color:black; font-size:large; font-weight:bold } attributes {font-family:Arial; color:black; font-size:small; font-weight:normal}";
    //Start of listing
    let newPage = "<html><head>" + "<style type=\"text/css\">" + css + "</style>" + " </head><body>";
    //concatenate all atributes to listing
    newPage += "<headline>" + gcIcon + gcCode + ": " + gcName + "</headline><br>";
    newPage += "<b>Owner:</b> " + gcOwner + " | <b>seit:</b> " + gcHidden + " | <b>Koord:</b> " + gcKoord + "<br>";
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

function getGcName(){
    //Get Cache name
    let gcname = document.getElementById('ctl00_ContentBody_CacheName').textContent;
    gcname = gcname.trim();
    return gcname;
}

function getGcCode(){
    //Get GC-Code
    let gccode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
    gccode = gccode.trim();
    return gccode;
}
function getGcOwner(){
    let gccachedetails = document.getElementById('ctl00_ContentBody_mcd1').textContent;
    gccachedetails = gccachedetails.trim();
    //Get gcowner
    let gcownerStart = ("A cache by ").length
    let gcownerEnd = 0;
    if (document.getElementsByClassName("ctoc_link").length === 0){
        gcownerEnd = gccachedetails.search(/Message this owner/i);
    } else {
        gcownerEnd = gccachedetails.length;
    }
    let gcowner = gccachedetails.slice(11,gcownerEnd);
    gcowner = gcowner.trim();
    return gcowner;
};
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
            gcwp += "<td width=30%>" + document.getElementById('ctl00_ContentBody_Waypoints').getElementsByTagName('tr')[n].childNodes[9].textContent.replace('(Parking Area)',' PA').replace(' (Question to Answer)',' QtA').replace('(Stages of a Multicache)','SoM').replace('(Physical Stage)','(PS)').replace('(Virtual Stage)','(VS)').replace('(Final Location)',' F').trim() + "</td>";
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
    let gcSize = document.getElementById('ctl00_ContentBody_size');
    //alert(gcSize);
    gcSize = gcSize.getElementsByTagName("img")[0].alt;
    //alert(gcSize);
    gcSize = gcSize.replace(/Size: /, "");
    gcSize = gcSize.trim();
    return gcSize;
}
function getGcKoord(){
    gcKoord = document.getElementById('uxLatLon').innerHTML;
    gcKoord = gcKoord.trim();
    gcKoord = gcKoord.replace('N ', 'N');
    gcKoord = gcKoord.replace('E ', 'E');
}
function getGcHidden(){
    let gcHidden = document.getElementById('ctl00_ContentBody_mcd2');
    gcHidden = gcHidden.innerHTML;
    gcHidden = gcHidden.trim();
    let gcHiddenLength = gcHidden.length;
    let gcHiddenDate = gcHidden.substring((gcHiddenLength-10));
    //let gcHiddenDate = gcHidden.substring(gcHiddenLength - 10, (gcHiddenLength-10));
    let gcHiddenYear = gcHiddenDate.substring(gcHiddenDate.length-4);
    let gcHiddenDay = gcHiddenDate.slice(3,5);
    let gcHiddenMonth = gcHiddenDate.slice(0,2);
    gcHidden = gcHiddenDay + "." + gcHiddenMonth.trim() + "." + gcHiddenYear;
    return gcHidden;
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
    let lvGcIcon = document.getElementsByClassName('cacheDetailsTitle')[0].innerHTML;
    let pos0 = lvGcIcon.search(/title=\"/i);
    let pos1 = lvGcIcon.search(/ aria-label/i);
    let iconTypeName = lvGcIcon.substring(pos0+7,pos1-1);

    let iconType = '';
    let iconAltText = '';
    switch(iconTypeName){
        case 'Traditional Geocache':
            iconType = "https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_traditional-1.png";
            iconAltText = 'Tradi';
            //iconType = 'icon-2';
            break;
        case 'Mystery Cache':
            //iconType = 'icon-8';
            iconType = "https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_mystery.png";
            iconAltText = 'Mystery';
            break;
        case 'Multi-cache':
            //iconType = 'icon-3';
            iconType = "https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_multi.png";
            iconAltText = 'Multi';
            break;
        case 'Earthcache':
            iconType = 'icon-137';
            iconAltText = 'Earthcache';
            break;
        case 'Letterbox Hybrid':
            //iconType = 'icon-5';
            iconType = "https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_letterbox.png";
            iconAltText = 'Letterbox';
            break;
        case 'Event Cache':
            iconType = 'icon-6';
            iconAltText = 'Event';
            break;
        case 'Cache In Trash Out Event (CITO)':
            iconType = 'icon-13';
            iconAltText = 'CITO';
            break;
        case 'Mega-Event Cache':
            iconType = 'icon-453';
            iconAltText = 'Mega';
            break;
        case 'Giga-Event Cache':
            iconType = 'icon-7005';
            iconAltText = 'Giga';
            break;
        case 'Wherigo Cache':
            //iconType = 'icon-1858';
            iconType = "https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_wherigo.png";
            iconAltText = 'Wherigo';
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
    //https://d3mo08i005h0zn.cloudfront.net/blog/wp-content/uploads/2018/03/cache_icon_type_traditional-1.png
    //gcIcon = '<svg class="icon cache-icon" role="presentation" width="20" height="20"><use xlink:href="';
    //gcIcon = gcIcon + '/app/ui-icons/sprites/cache-types.svg#';
    //gcIcon = gcIcon + iconType;
    //gcIcon = gcIcon + '"></use></svg>';
    gcIcon = '<img src="' + iconType + '" width="24" high="24" alt="' + iconAltText + '">';
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
