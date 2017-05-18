// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function Tracador3DWGL (aExpressao, aDominioInicial, aDominioIntervalo, aDominioPontos, aCor)

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
	this.cor= aCor ? aCor : [0.25, 0.41, 0.88, 1];
	this.wgl= 0;
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

Tracador3DWGL.prototype.calcular= function ()

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

Tracador3DWGL.prototype.desenhar= function (aMatriz, aLimpa, aQtdVertices3D)

{
	var wgl= this.wgl;
	var gl= wgl.rc;
	if (gl) {
		if (aLimpa) {
			gl.clearColor (1.0, 1.0, 1.0, 1.0);
			gl.enable (gl.DEPTH_TEST);
			gl.depthFunc (gl.LEQUAL);
			gl.viewport (wgl.viewport[0], wgl.viewport[1], wgl.viewport[2], wgl.viewport[3]);
			gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}

		gl.useProgram (wgl.shaderProgram);
		wgl.selecionarBuffer ('vertices');
		wgl.selecionarBuffer ('cores');
		gl.uniformMatrix4fv (gl.getUniformLocation (wgl.shaderProgram, 'matriz'), false, aMatriz);

		gl.drawArrays (gl.LINES, 0, aQtdVertices3D);
	}
	if (wgl.erro != '')
		alert ('Erro: ' + wgl.erro);
}

Tracador3DWGL.prototype.inicializar= function (aQuadro, aVertices)

{
	if (!this.wgl.configurar (aQuadro, true, [0, 0, aQuadro.width, aQuadro.height]))
		alert ('[1] Erro: ' + this.wgl.erro);
	else
		try {
			this.montar (aVertices);
			this.redimensionar (aQuadro.width, aQuadro.height);
		}
		catch (e) {
			alert ('[2] Erro: ' + e);
		}
}

Tracador3DWGL.prototype.montar= function (aVertices)

{
	var vertices3D= this.operador.reservar (aVertices.length*3);
	var cores= this.operador.reservar (aVertices.length*4);
	var c= 0, j= 0;
	for (var i= 0; i < aVertices.length; i++) {
		vertices3D[j++]= aVertices[i].x;
		vertices3D[j++]= aVertices[i].y;
		vertices3D[j++]= aVertices[i].z;

		cores[c++]= this.cor[0];
		cores[c++]= this.cor[1];
		cores[c++]= this.cor[2];
		cores[c++]= this.cor[3];
	}

	if (this.wgl.rc) {
		this.wgl.reservarBuffer ('vertices', vertices3D);
		this.wgl.reservarBuffer ('cores', cores);
	}
}

Tracador3DWGL.prototype.redimensionar= function (aLargura, aAltura)

{
	if (this.wgl && this.wgl.canvas && this.operador) {
		this.wgl.canvas.width= aLargura;
		this.wgl.canvas.height= aAltura;
		this.wgl.viewport[2]= this.wgl.canvas.width;
		this.wgl.viewport[3]= this.wgl.canvas.height;
		var proporcao= this.wgl.viewport[2]/this.wgl.viewport[3];
		this.matrizProjection= this.operador.obterPerspectiva (this.angulo, proporcao, 1, 100.0);
	}
}

Tracador3DWGL.prototype.tracar= function (aQuadro, aVertices, aEye, aRotacao)

{
	if (!this.operador)
		this.operador= new Operador3D ();
	if (!this.wgl) {
		this.wgl= new WebGL ();
		this.inicializar (aQuadro, aVertices);
	}

	if ((this.erro == '') && (this.calculadora3D.obterExpressao () != '')) {
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

		// Desenhar
			this.desenhar (matriz, true, aVertices.length);
	}
}