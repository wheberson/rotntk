// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function Desenho2D (aQuadro, aViewport)

{
	this.quadro= aQuadro;
	this.c= aQuadro.getContext ('2d');
	this.viewport= aViewport;
	//this.c.globalCompositeOperation= 'destination-over';
}

Desenho2D.prototype.desenharTriangulo= function (aV0, aV1, aV2)

{
	this.c.beginPath ();
		if (aV0.cor)
			this.c.strokeStyle= aV0.cor;
		this.c.moveTo (aV0.ponto[0], aV0.ponto[1]);
		this.c.lineTo (aV1.ponto[0], aV1.ponto[1]);
	this.c.stroke ();
	
	this.c.beginPath ();
		if (aV1.cor)
			this.c.strokeStyle= aV1.cor;
		this.c.moveTo (aV1.ponto[0], aV1.ponto[1]);
		this.c.lineTo (aV2.ponto[0], aV2.ponto[1]);
	this.c.stroke ();

	this.c.beginPath ();
		if (aV2.cor)
			this.c.strokeStyle= aV2.cor;
		this.c.moveTo (aV2.ponto[0], aV2.ponto[1]);
		this.c.lineTo (aV0.ponto[0], aV0.ponto[1]);
	this.c.stroke ();
}

// Triangle strip. Cada vertice: {ponto, cor}
Desenho2D.prototype.desenhar= function (aVertices)

{
	var n= aVertices.length;
	if (n > 0) {
		var triangulo= new Array (3);
		var praCima= false;
		var i= 0, iStrip= 0;
		while (i < n) {
			i= iStrip;
			praCima= !praCima;
			if (praCima) {
				if (i+2 >= n)
					break;
				triangulo[0]= aVertices[i+0];
				triangulo[1]= aVertices[i+1];
				triangulo[2]= aVertices[i+2];
				i+= 2;
			}
			else {
				if (i+3 >= n)
					break;
				triangulo[0]= aVertices[i+2];
				triangulo[1]= aVertices[i+1];
				triangulo[2]= aVertices[i+3];
				iStrip= i+2;
				i+= 3;
			}
			this.desenharTriangulo (triangulo[0], triangulo[1], triangulo[2]);
		}
	}
}

Desenho2D.prototype.limpar= function ()

{
	this.c.clearRect (this.viewport[0], this.viewport[1], this.viewport[2], this.viewport[3]);
}

// Mapeia x, y para o viewport
Desenho2D.prototype.visualizar= function (aVertice)

{
	return [this.viewport[0] + aVertice[0]*this.viewport[2], this.viewport[3] - (this.viewport[1] + aVertice[1]*this.viewport[3])];
}