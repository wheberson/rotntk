// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function Tracador3DCanvas (aExpressao, aDominioInicial, aDominioIntervalo, aDominioPontos, aCor)

{
	this.erro= '';
	this.angulo= 45;
	this.calculadora3D= new Calculadora (aExpressao, ['x', 'y']);
	this.dominioInicial= parseFloat (aDominioInicial);
	this.dominioIntervalo= parseFloat (aDominioIntervalo);
	this.dominioPontos= parseInt (aDominioPontos, 10);
	this.dominioFinal= this.dominioInicial + this.dominioIntervalo*(this.dominioPontos-1);
	this.imagemInicial= 0;
	this.imagemFinal= 0;
	this.cor= aCor ? aCor : 'royalblue';
	this.desenho= 0;
	this.operador= 0;
	this.matrizProjection= 0;

	if (isNaN (this.dominioInicial))
		this.erro= 'Dominio inicial deve ser um numero real';
	else if (isNaN (this.dominioFinal))
		this.erro= 'Dominio final deve ser um numero real';
	else if (isNaN (this.dominioIntervalo) || (this.dominioIntervalo == 0) || (this.dominioIntervalo < -16384) || (this.dominioIntervalo > 16384))
		this.erro= 'Intervalo entre pontos do dominio deve ser um numero real diferente de 0 entre -16384 e 16384';
	else if (isNaN (this.dominioPontos) || (this.dominioPontos < 2) || (this.dominioPontos > 16384))
		this.erro= 'Qtd pontos do dominio deve ser um numero inteiro entre 2 e 16384';
	else if (this.dominioInicial >= this.dominioFinal)
		this.erro= 'Dominio inicial (' + this.dominioInicial + ') deve ser menor que o final (' + this.dominioFinal + ')';
	else if (this.calculadora3D.erroExp != '')
		this.erro= 'Expressao incorreta: ' + this.calculadora3D.erroExp;
}

Tracador3DCanvas.prototype.calcular= function ()

{
	if ((this.erro != '') || (this.calculadora3D.obterExpressao () == ''))
		return [];
	else {
		var dominioPontosTotal= this.dominioPontos*2;
		var retorno= new Array (dominioPontosTotal);
		var dX= this.dominioInicial;
		var dY= this.dominioInicial;
		var m= 0;
		this.imagemInicial= this.imagemFinal= 0;
		for (var i= 0; i < this.dominioPontos; i++) {
			dX= this.dominioInicial;
			for (var j= 0; j < this.dominioPontos; j++) {
				var dZ= this.calculadora3D.recalcular ({x: dX, y: dY});
				if (!isFinite (dZ))
					dZ= (dZ == Number.NEGATIVE_INFINITY) ? Number.MIN_VALUE : Number.MAX_VALUE;
				retorno[m++]= {x: dX, y: dY, z: dZ, D: {x: 0, y: 0, z: 0}};
				dX+= this.dominioIntervalo;
				if (dZ > this.imagemFinal)
					this.imagemFinal= dZ;
				if (dZ < this.imagemInicial)
					this.imagemInicial= dZ;
			}
			dY+= this.dominioIntervalo;
		}
		return retorno;
	}
}

Tracador3DCanvas.prototype.redimensionar= function (aLargura, aAltura)

{
	if (this.desenho && this.desenho.quadro && this.operador) {
		this.desenho.quadro.width= aLargura;
		this.desenho.quadro.height= aAltura;
		this.desenho.viewport[2]= this.desenho.quadro.width;
		this.desenho.viewport[3]= this.desenho.quadro.height;
		var proporcao= this.desenho.viewport[2]/this.desenho.viewport[3];
		this.matrizProjection= this.operador.obterPerspectiva (this.angulo, proporcao, 1, 100.0);
	}
}

Tracador3DCanvas.prototype.tracar= function (aQuadro, aVertices, aEye, aRotacao)

{
	if (!this.desenho)
		this.desenho= new Desenho2D (aQuadro, [0, 0, aQuadro.width, aQuadro.height]);
	if (!this.operador)
		this.operador= new Operador3D ();
	if (!this.matrizProjection)
		this.redimensionar (aQuadro.width, aQuadro.height);

	this.desenho.limpar ();

	if ((this.erro == '') && (this.calculadora3D.obterExpressao () != '')) {
		var vertices2D= new Array (aVertices.length);

		// Transformaçoes
			var matrizWorld= this.operador.obterIdentidade ();
			matrizWorld= this.operador.rotacionar (matrizWorld, aRotacao[0], [1, 0, 0]);
			matrizWorld= this.operador.rotacionar (matrizWorld, aRotacao[1], [0, 1, 0]);
			matrizWorld= this.operador.rotacionar (matrizWorld, aRotacao[2], [0, 0, 1]);
			var matrizView= this.operador.olharPara (aEye, [0, 0, 0], [0, 1, 0]);

			var matriz= this.operador.obterIdentidade ();
			matriz= this.operador.multiplicar (matriz, matrizWorld);
			matriz= this.operador.multiplicar (matriz, matrizView);
			matriz= this.operador.multiplicar (matriz, this.matrizProjection);

			// Transforma cada vertice 3D em coordenadas de dispositivo 2D
				for (var i= 0; i < aVertices.length; i++) {
					var vertice= [aVertices[i].x, aVertices[i].y, aVertices[i].z, 1.0];
					var coord= this.operador.visualizar (matriz, vertice);
					vertices2D[i]= {ponto: this.desenho.visualizar (coord), cor: this.cor};
				}

		// Desenhar
			this.desenho.desenhar (vertices2D);
	}
}