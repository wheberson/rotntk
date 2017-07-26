<?php
// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

// dd/mm/aaaa ou dd/mm/aaaa hh:mm ou dd/mm/aaaa hh:mm:ss
function adcDias ($aValor, $aQtd)

{
	$retorno= $aValor;
	if (!empty ($aQtd) && ($aQtd != 0) && is_numeric ($aQtd)) {
		$f= obterDataFormato ($aValor);
		$v= cnvDataAAAAMMDD ($aValor);
		$retorno= $aQtd > 0 ? date ($f, strtotime ("$v +$aQtd days")) : date ($f, strtotime ("$v $aQtd days"));
	}
	return $retorno;
}

function cnvDataAAAAMMDD ($aValor)

{
	$retorno= '';
	if (!empty ($aValor)) {
		$h= '';
		$n= strlen ($aValor);
		if ($n == 10)
			$cmp= explode ('/', $aValor);
		else {
			$cmp= explode (' ', $aValor);
			$h= ' ' . $cmp[1];
			$cmp= explode ('/', $cmp[0]);
		}
		$retorno= $cmp[2] . '-' . $cmp[1] . '-' . $cmp[0] . $h;
	}
	return $retorno;
}

// String (dd/mm/aaaa ou dd/mm/aaaa hh:mm ou dd/mm/aaaa hh:mm:ss) pra Date
function cnvStringParaDate ($aValor)

{
	return empty ($aValor) ? '' : date (obterDataFormato ($aValor), cnvStringParaTime ($aValor));
}

// String (dd/mm/aaaa ou dd/mm/aaaa hh:mm ou dd/mm/aaaa hh:mm:ss) pra Timestamp
function cnvStringParaTime ($aValor)

{
	$retorno= 0;
	if (!empty ($aValor)) {
		$n= strlen ($aValor);
		if ($n == 10) {
			$cmp= explode ('/', $aValor);
			if (count ($cmp) == 3)
				$retorno= mktime (0, 0, 0, $cmp[1], $cmp[0], $cmp[2]);
		}
		else {
			$cmp= explode (' ', $aValor);
			if (count ($cmp) == 2) {
				$cmpD= explode ('/', $cmp[0]);
				$cmpH= explode (':', $cmp[1]);
				if ((count ($cmpD) == 3) && ($cmpH >= 2)) {
					$s= ($cmpH > 2) ? $cmpH[2] : 0;
					$retorno= mktime ($cmpH[0], $cmpH[1], $s, $cmpD[1], $cmpD[0], $cmpD[2]);
				}
			}
		}
	}
	return $retorno;
}

// Menor que 0: aData1 anterior a aData2; igual a 0: aData1 = aData2; maior que 0: aData1 posterior a aData2
function compararDatas ($aData1, $aData2)

{
	return cnvStringParaTime ($aData1) - cnvStringParaTime ($aData2);
}

// dd/mm/aaaa ou dd/mm/aaaa hh:mm ou dd/mm/aaaa hh:mm:ss
function obterDataFormato ($aValor)

{
	$retorno= '';
	if (!empty ($aValor)) {
		$n= strlen ($aValor);
		$retorno= 'd/m/Y';
		if ($n == 16)
			$retorno= 'd/m/Y h:i';
		else if ($n == 19)
			$retorno= 'd/m/Y h:i:s';
	}
	return $retorno;
}

function obterMes ($aValor)

{
	$retorno= '';
	if (!empty ($aValor))
		switch ($aValor) {
			case  1: $retorno= 'Janeiro'; break;
			case  2: $retorno= 'Fevereiro'; break;
			case  3: $retorno= 'Março'; break;
			case  4: $retorno= 'Abril'; break;
			case  5: $retorno= 'Maio'; break;
			case  6: $retorno= 'Junho'; break;
			case  7: $retorno= 'Julho'; break;
			case  8: $retorno= 'Agosto'; break;
			case  9: $retorno= 'Setembro'; break;
			case 10: $retorno= 'Outubro'; break;
			case 11: $retorno= 'Novembro'; break;
			case 12: $retorno= 'Dezembro'; break;
		}
	return $retorno;
}

function obterMeses ($aInicial=1, $aFinal=12)

{
	$retorno= array ();
	$iInicial= empty ($aInicial) ? 0 : $aInicial;
	$iFinal= empty ($aFinal) ? 0 : $aFinal;
	if (!empty ($iInicial) && !empty ($iFinal) && ($iInicial <= $iFinal) && ($iFinal <= 12))
		for ($i= $iInicial; $i <= $iFinal; $i++)
			$retorno[$i]= obterMes ($i);
	return $retorno;
}

// dd/mm/aaaa
function validarData ($aValor)

{
	$retorno= false;
	if (!empty ($aValor) && (strlen ($aValor) == 10)) {
		$cmp= explode ('/', $aValor);
		$retorno= (count ($cmp) == 3) && checkdate ($cmp[1], $cmp[0], $cmp[2]);
	}
	return $retorno;
}
?>
