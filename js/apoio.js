// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php
// Requer 'gambiarra.js'

function cnvNumeroParaPeso (aValor, aTrunca, aCasas, aSempreAbreviar, aSufixaZero, aEmDecimal, aEmOctetos, aPesos)

{
	var retorno= '';
	if (aValor) {
		var valor= parseInt (aValor, 10);
		if (!isNaN (valor)) {
			var pesos= {
							binario: {
								potencia: [1024, 1048576, 1073741824, 1099511627776, 1125899906842624, 1152921504606846976],
								oct: [' kio', ' mio', ' gio', ' tio', ' pio', ' eio'],
								byt: [' KiB', ' MiB', ' GiB', ' TiB', ' PiB', ' EiB']
							},
							decimal: {
								potencia: [1000, 1000000, 1000000000, 1000000000000, 1000000000000000, 1000000000000000000],
								oct: [' ko', ' mo', ' go', ' to', ' po', ' eo'],
								byt: [' KB', ' MB', ' GB', ' TB', ' PB', ' EB']
							}
						};
			if (aPesos)
				pesos= aPesos;
			var simbolos= aEmDecimal ? (aEmOctetos ? pesos.decimal.oct : pesos.decimal.byt) : (aEmOctetos ? pesos.binario.oct : pesos.binario.byt);
			var potencias= aEmDecimal ? pesos.decimal.potencia : pesos.binario.potencia;
			if (valor <= 0)
				retorno= '0' + (aSufixaZero ? simbolos[0] : '');
			else if (valor < 1024) {
				if (aSempreAbreviar) {
					valor/= 1024;
					if (aTrunca)
						valor= Math.trunc (valor);
					else if (aCasas)
						valor= valor.toFixed (aCasas);
					retorno= aSempreAbreviar ? (valor.toString () + simbolos[0]) : valor.toString ();
				}
				else
					retorno= valor.toString ();
			}
			else
				for (var p= 1; p < 6; p++)
					if (valor == potencias[p]) {
						retorno= '1' + simbolos[p];
						break;
					}
					else if (valor < potencias[p]) {
						valor/= potencias[p-1];
						if (aTrunca)
							valor= Math.trunc (valor);
						else if (aCasas)
							valor= valor.toFixed (aCasas);
						retorno= valor.toString () + simbolos[p-1];
						break;
					}
		}
	}
	return retorno;
}

// ddd.ddd.ddd-dd -> ddddddddddd
function desformatarCPF (aValor)

{
	return aValor ? manterDigitosSomente (aValor).substr (0, 11) : '';
}

// ddddddddddd -> ddd.ddd.ddd-dd
function formatarCPF (aValor)

{
	var retorno= '';
	var cpf= desformatarCPF (aValor);
	if (cpf != '')
		for (var i= 0; i < cpf.length; i++) {
			var digito= cpf.charAt (i);
			if ((i == 3) || (i == 6))
				retorno+= '.';
			else if (i == 9)
				retorno+= '-';
			retorno+= digito;
		}
	return retorno;
}

function gerarDVModulo11 (aValor)

{
	var retorno= '';
	var valor= aValor ? aValor.trim () : '';
	if (valor != '') {
		var dv= 0;
		var f= 2;
		var n= valor.length;
		for (var j= n-1; j >= 0; j--) {
			dv+= valor.charAt (j) * f++;
			if (f == 10)
				f= 2;
		}
		if (dv > 0) {
			dv= (dv * 10) % 11;
			if (dv >= 10)
				dv= 0;
		}
		retorno= dv.toString ();
	}
	return retorno;
}

function gerarDVCPF (aValor)

{
	var retorno= '';
	var valor= aValor ? aValor.trim () : '';
	if (valor != '') {
		var v1= v2= 0;
		var m1= 10;
		var m2= 11;
		for (var i= 0; i < 9; i++) {
			var digito= valor.charAt (i);
			v1+= digito * m1--;
			v2+= digito * m2--;
		}
		v1= (v1 * 10) % 11;
		v1= v1 >= 10 ? 0 : v1;
		v2+= v1 * m2;
		v2= (v2 * 10) % 11;
		v2= v2 >= 10 ? 0 : v2;
		retorno= v1.toString () + v2.toString ();
	}
	return retorno;
}

function manterDigitosSomente (aValor)

{
	return aValor ? aValor.replace (/[^0-9]/g, '') : ''; // Remove tudo exceto 0 a 9
}

function validarCPF (aValor)

{
	var retorno= false;
	var cpf= aValor ? aValor.trim () : '';

	// Desconsiderar CPF que contenha caracteres nao numericos ou que seja tudo de mesmo digito. Ex.: 11111111111
		if ((cpf != '') && (cpf.length == 11) && !cpf.match (/[^0-9]|([0-9])\1{10}/g)) {
			var dv= gerarDVCPF (cpf.substr (0, 9));
			retorno= (cpf.charAt (9) == dv.charAt (0)) && (cpf.charAt (10) == dv.charAt (1));
		}

	return retorno;
}

function validarModulo11 (aValor)

{
	var retorno= false;
	var valor= aValor ? aValor.trim () : '';
	var n= valor.length;
	if (n > 1) {
		var dv= gerarDVModulo11 (valor.substr (0, n-1));
		retorno= (dv != '') && (valor.charAt (n-1) == dv);
	}
	return retorno;
}