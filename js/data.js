// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function obterData (aValor)

{
	if (!aValor || (aValor.length != 10))
		return 0;
	else {
		var cmp= aValor.split ('/');
		return (cmp.length < 3) ? 0 : new Date (cmp[2], parseInt (cmp[1], 10)-1, cmp[0], 10, 0, 0, 0);
	}
}

function validarData (aValor)

{
	if (!aValor || (aValor.length != 10))
		return false;
	else {
		var cmp= aValor.split ('/');
		if (cmp.length < 3)
			return false;
		else {
			var dia= parseInt (cmp[0], 10);
			var mes= parseInt (cmp[1], 10) - 1;
			var ano= parseInt (cmp[2], 10);
			var d= new Date (ano, mes, dia, 10, 0, 0, 0);
			return ((d.getFullYear () == ano) && (d.getMonth () == mes) && (d.getDate () == dia));
		}
	}
}