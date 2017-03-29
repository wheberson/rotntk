<?php
// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

// ddd.ddd.ddd-dd -> ddddddddddd
function desformatarCPF ($aValor)

{
	return empty ($aValor) ? '' : substr (manterDigitosSomente ($aValor), 0, 11);
}

// ddddddddddd -> ddd.ddd.ddd-dd
function formatarCPF ($aValor)

{
	$retorno= '';
	$cpf= desformatarCPF ($aValor);
	if ($cpf != '') {
		$n= strlen ($cpf);
		for ($i= 0; $i < $n; $i++) {
			$digito= $cpf[$i];
			if (($i == 3) || ($i == 6))
				$retorno.= '.';
			else if ($i == 9)
				$retorno.= '-';
			$retorno.= $digito;
		}
	}
	return $retorno;
}

function gerarDVModulo11 ($aValor)

{
	$retorno= '';
	$valor= trim ($aValor);
	if (!empty ($valor)) {
		$dv= 0;
		$f= 2;
		$n= strlen ($valor);
		for ($j= $n-1; $j >= 0; $j--) {
			$dv+= $valor[$j] * $f++;
			if ($f == 10)
				$f= 2;
		}
		if ($dv > 0) {
			$dv= ($dv * 10) % 11;
			if ($dv >= 10)
				$dv= 0;
		}
		$retorno= strval ($dv);
	}
	return $retorno;
}

function gerarDVCPF ($aValor)

{
	$retorno= '';
	$valor= trim ($aValor);
	if (!empty ($valor)) {
		$v1= $v2= 0;
		$m1= 10;
		$m2= 11;
		for ($i= 0; $i < 9; $i++) {
			$digito= $valor[$i];
			$v1+= $digito * $m1--;
			$v2+= $digito * $m2--;
		}
		$v1= ($v1 * 10) % 11;
		$v1= $v1 >= 10 ? 0 : $v1;
		$v2+= $v1 * $m2;
		$v2= ($v2 * 10) % 11;
		$v2= $v2 >= 10 ? 0 : $v2;
		$retorno= $v1 . $v2;
	}
	return $retorno;
}

function manterDigitosSomente ($aValor)

{
	return empty ($aValor) ? '' : preg_replace ('/[^0-9]/', '', $aValor); // Remove tudo exceto 0 a 9
}

function validarCPF ($aValor)

{
	$retorno= false;
	$cpf= trim ($aValor);

	// Desconsiderar CPF que contenha caracteres nao numericos ou que seja tudo de mesmo digito. Ex.: 11111111111
		if (!empty ($cpf) && (strlen ($cpf) == 11) && !preg_match ('/[^0-9]|([0-9])\1{10}/', $cpf)) {
			$dv= gerarDVCPF (substr ($cpf, 0, 9));
			$retorno= !empty ($dv) && ($cpf[9] == $dv[0]) && ($cpf[10] == $dv[1]);
		}

	return $retorno;
}

function validarModulo11 ($aValor)

{
	$retorno= false;
	$valor= trim ($aValor);
	$n= strlen ($valor);
	if (!empty ($valor) && ($n > 1)) {
		$dv= gerarDVModulo11 (substr ($valor, 0, $n-1));
		$retorno= !empty ($dv) && ($valor[$n-1] == $dv);
	}
	return $retorno;
}
?>
