// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
Math.trunc= Math.trunc || function (x) {return x < 0 ? Math.ceil (x) : Math.floor (x);}

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
String.prototype.trim= String.prototype.trim || function () {return this.replace (/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');}