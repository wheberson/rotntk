// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function Calculadora (aExpressao, aFnc)

{
	this.erro= this.erroExp= '';
	var expressao= aExpressao.trim ();
	var propMath= this.obterMembrosMath (false, false);
	var funcDefinida= false;
	if (aFnc.length > 0) {
		this.erroExp= definirFnc (aFnc);
		funcDefinida= this.erroExp == '';
		if (funcDefinida)
			expressao= cnvMath ();
	}

	function cnvMath ()

	{
		var retorno= expressao;
		for (var j= 0; j < propMath.length; j++)
			retorno= retorno.replace (new RegExp ('\\b' + propMath[j] + '\\b', 'gi'), 'Math.' + propMath[j]);
		return retorno.replace (/[\u03C0]/gi, 'Math.PI ');
	}

	function definirFnc (aFnc)

	{
		for (var f= 0; f < aFnc.length; f++)
			expressao= expressao.replace (new RegExp ('\\b' + aFnc[f] + '\\b', 'gi'), ' ' + aFnc[f].toLowerCase () + ' ');
		var ant= expressao;
		for (var f= 0; f < aFnc.length; f++)
			expressao= expressao.replace (new RegExp ('\\b' + aFnc[f] + '\\b', 'g'), ' 1 ');
		var retorno= validar ();
		expressao= ant;
		return retorno;
	}

	function obterPropMathForma ()

	{
		var retorno= '';
		for (var j= 0; j < propMath.length; j++)
			retorno+= (retorno == '' ? '' : '|') + propMath[j];
		return '\\b(' + retorno + ')\\b';
	}

	// Validos: 0 a 9, +, -, *, %, /, (, ), ., ,, espaço, π, funçoes e constantes do objeto Math
	function validar ()

	{
		var retorno= expressao;
		retorno= retorno.replace (new RegExp (obterPropMathForma (), 'gi'), '');
		if (retorno != '')
			retorno= retorno.replace (/[0-9\-\+\*\/\%\(\)\.\,\s\u03C0]/gi, '');
		return retorno;
	}

	this.calcular= function ()

	{
		var retorno= Number.NaN;
		this.erro= '';
		this.erroExp= validar ();
		if (this.erroExp != '')
			this.erro= 'expressao incorreta';
		else
			try {
				retorno= eval (cnvMath ());
			}
			catch (e) {
				retorno= Number.NaN;
				this.erro= e.message;
			}
		return retorno;
	}

	this.obterExpressao= function ()

	{
		return expressao;
	}

	this.obterFuncDefinida= function ()

	{
		return funcDefinida;
	}
}

Calculadora.prototype.recalcular= function (aValor)

{
	var retorno= Number.NaN;
	if (this.obterFuncDefinida () && (this.erro == '') && (this.erroExp == '')) {
		var x, y, z;
		for (chave in aValor)
			switch (chave) {
				case 'x': case 'X':
					x= aValor[chave];
					break;
				case 'y': case 'Y':
					y= aValor[chave];
					break;
				case 'z': case 'Z':
					z= aValor[chave];
					break;
			}
		try {
			retorno= eval (this.obterExpressao ());
		}
		catch (e) {
			retorno= Number.NaN;
			this.erro= e.message;
		}
	}
	return retorno;
}

Calculadora.prototype.obterMembrosMath= function (aMinusculo, aAscendente)

{
	var retorno= [];
	Object.getOwnPropertyNames (Math).filter (
		function (aValor)

		{
			var p= aValor.toLowerCase ();
			if (p != 'tosource')
				retorno.push (aMinusculo ? p : aValor);
		}
	);
	return retorno.sort (
		function (aX, aY)

		{
			return aAscendente ? aX.toLowerCase ().localeCompare (aY.toLowerCase ()) : aY.toLowerCase ().localeCompare (aX.toLowerCase ());
		}
	);
}