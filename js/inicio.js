// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
Math.trunc= Math.trunc || function (x) {return x < 0 ? Math.ceil (x) : Math.floor (x);}

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
String.prototype.trim= String.prototype.trim || function () {return this.replace (/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');}

$(document).ready (
	function ()

	{
		$('.inteiro').on ('keyup change',
			function ()

			{
				var V= $(this).val ().trim ().replace (/[^0-9\+\-]|[\+\-]{2}/g, ''); // Remove tudo exceto 0 a 9 ou + ou - (remove tambem ++ ou -- ou +- ou -+)
				if (V.match (/[0-9]+[\+\-]/g)) // Procura por digito seguido de + ou -
					V= V.replace (/[\+\-]+$/, ''); // Remove + ou - no final da frase
				$(this).val (V);
			}
		);

		$('.inteiro-positivo').on ('keyup change',
			function ()

			{
				$(this).val ($(this).val ().trim ().replace (/[^0-9]/g, '')); // Remove tudo exceto 0 a 9
			}
		);

		$('.real').on ('keyup change',
			function ()

			{
				var V= $(this).val ().trim ().replace (/[^0-9\+\-\.]|[\+\-]{2}/g, ''); // Remove tudo exceto 0 a 9 ou + ou - ou . (remove tambem ++ ou -- ou +- ou -+)
				if (V.match (/[0-9]+[\+\-]/g)) // Procura por digito seguido de + ou -
					V= V.replace (/[\+\-]+$/, ''); // Remove + ou - no final da frase
				V= V.replace (/[\.]{2,}/g, '.'); // Remove .. por .
				if (V.match (/[0-9]+[\.]+[0-9]+[\.]/g)) // Procura por digito.digito. (ex.: 123.57.)
					V= V.replace (/[\.]+$/, ''); // Remove . no final da frase
				$(this).val (V);
			}
		);

		$('.real-positivo').on ('keyup change',
			function ()

			{
				var V= $(this).val ().trim ().replace (/[^0-9\.]/g, ''); // Remove tudo exceto 0 a 9 ou .
				V= V.replace (/[\.]{2,}/g, '.'); // Remove .. por .
				if (V.match (/[0-9]+[\.]+[0-9]+[\.]/g)) // Procura por digito.digito. (ex.: 123.57.)
					V= V.replace (/[\.]+$/, ''); // Remove . no final da frase
				$(this).val (V);
			}
		);

		if ($.isFunction (aoCarregar))
			aoCarregar ();
	}
);