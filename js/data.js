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

function obterDataCorrente (aComHoras, aComMinutos, aComSegundos)

{
	var d= new Date ();
	var dia= d.getDate ();
	var mes= parseInt (d.getMonth (), 10) + 1;
	var dh= '';
	if (aComHoras) {
		var horas= d.getHours ();
		var minutos= d.getMinutes ();
		var segundos= d.getSeconds ();
		dh= ' ' + (horas <= 9 ? '0' + horas : horas);
		if (aComMinutos) {
			dh+= ':' + (minutos <= 9 ? '0' + minutos : minutos);
			if (aComSegundos)
				dh+= ':' + (segundos <= 9 ? '0' + segundos : segundos);
		}
	}
	return (dia <= 9 ? '0' + dia : dia) + '/' + (mes <= 9 ? '0' + mes : mes) + '/' + d.getFullYear () + dh;
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
			if (isNaN (cmp[0]) || isNaN (cmp[1]) || isNaN (cmp[2]))
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
}

function validarDataHora (aValor)

{
	var serHM= aValor && (aValor.length == 16);
	var serHMS= aValor && (aValor.length == 19);
	if ((serHM || serHMS) && (aValor[10] == ' ')) {
		var cmp= aValor.split (' ');
		var d= cmp[0];
		var h= cmp[1];
		if (!validarData (d))
			return false;
		else {
			cmp= h.split (':');
			if ((serHM && ((cmp.length != 2) || isNaN (cmp[0]) || isNaN (cmp[1]))) ||
				(serHMS && ((cmp.length != 3) || isNaN (cmp[0]) || isNaN (cmp[1]) || isNaN (cmp[2]))))
				return false;
			else { 
				var hora= parseInt (cmp[0], 10);
				var minuto= parseInt (cmp[1], 10);
				var segundo= serHM ? 0 : parseInt (cmp[2], 10);
				return (hora >= 0) && (hora <= 23) && (minuto >= 0) && (minuto <= 59) && (segundo >= 0) && (segundo <= 59);
			}
		}
	}
	else
		return false;
}
