<?php
// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

// Menor que 0: aData1 anterior a aData2; igual a 0: aData1 = aData2; maior que 0: aData1 posterior a aData2
function compararDatas ($aData1, $aData2)

{
	return cnvStringParaTime ($aData1) - cnvStringParaTime ($aData2);
}

// String (dd/mm/aaaa ou dd/mm/aaaa hh:mm ou dd/mm/aaaa hh:mm:ss) pra Date
function cnvStringParaDate ($aValor)

{
	$retorno= 0;
	if (!empty ($aValor)) {
		$n= strlen ($aValor);
		$f= 'd/m/Y';
		if ($n == 16)
			$f= 'd/m/Y h:i';
		else if ($n == 19)
			$f= 'd/m/Y h:i:s';
		$retorno= date ($f, cnvStringParaTime ($aValor));
	}
	return $retorno;
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