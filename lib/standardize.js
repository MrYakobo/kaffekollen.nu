module.exports.brand = (brand)=>{
    return brand.replace(/ ?eko/ig,'').replace(/é/gi,'e').replace(/CLASSIC|Arvidnordquist/ig, 'Arvid Nordquist').replace(/Löfbergs Lila/gi,'Löfbergs')
}