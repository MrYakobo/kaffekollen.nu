function regtest(string, obj, defaultvalue) {
    for (var i in obj) {
        if (new RegExp(i, 'gi').test(string)) {
            return obj[i]
        }
    }
    return defaultvalue
}
module.exports.test = regtest
module.exports.coffeetest = function (name) {
    //"preset" regexes
    return regtest(name, {
            '.*bönor.*': 'bönor',
            '.*kok.*': 'kok',
            'snabb.*|.*Nescafé.*': 'snabb',
            '.*prezzo.*': 'press'
        },
        'brygg')
}