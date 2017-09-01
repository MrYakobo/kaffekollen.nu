//ETT STORT FAILAT TÅGPROJEKT FINNS NEDAN::
String.prototype.capitalize = function () {
    var i = 0;
    var prev = 0;
    var s = JSON.parse(JSON.stringify(this))
    // console.log(arr)
    var space
    var iterations = 0;

    for (space = arr.indexOf(' ', i); space > -1 && iterations < 100; iterations++) {
        console.log(space)
        i = space + 1;
        //word length longer than 3 chars: capitalize
        if ((space - prev > 3)) {
            s[prev + 1] = s[prev + 1].toUpperCase()
        }
        prev = space;
    }
    return arr
}

String.prototype.capitalize2 = function () {
    var s = this[0].toUpperCase();
    var capNext = false;

    for (var i = 1; i < this.length; i++) {
        if (this[i] == ' ') {
            capNext = true
            s += ' '
        } else if (capNext) {
            s += this[i].toUpperCase()
            capNext = false
        } else {
            s += this[i]
        }
    }
    return s
}
String.prototype.regcap = function () {
    //search for a word with regex that is more than 3 chars long
    var reg = /(\w{3,})/
    var result;
    var s = JSON.parse(JSON.stringify(this))
    while (result = reg.exec(this) !== null) {
        s[result.index] = s.charAt(result.index).toUpperCase()
    }
    return s
}
// console.log("hej på dig".capitalize2())
console.log("hej på dig".regcap())