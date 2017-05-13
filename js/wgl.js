// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function WebGL ()

{
	this.aoCarregarShader= '';
	this.canvas= 0;
	this.erro= '';
	this.rc= 0;
	this.shaderProgram= 0;
	this.viewport= [0, 0, 0, 0];
	this.buffers= [];
	this.attributes= [];

	this.carregarShader= function (aVertex)

	{
		var retorno= '';
		if (typeof this.aoCarregarShader == 'function')
			retorno= this.aoCarregarShader (aVertex);
		else if (aVertex)
			retorno= 'attribute vec3 shaderVertexPosition; attribute vec4 shaderVertexColor; uniform mat4 matriz; varying lowp vec4 cor; void main (void) {gl_Position= matriz * vec4(shaderVertexPosition, 1.0); cor= shaderVertexColor;}';
		else
			retorno= 'varying lowp vec4 cor; void main (void) {gl_FragColor= cor;}';
		return retorno;
	}

	this.configurar= function (aCanvas, aConfiguraAutomaticamente, aViewport)

	{
		this.canvas= aCanvas;
		this.viewport= aViewport;
		var retorno= false;
		try {
			this.rc= aCanvas.getContext ('webgl') || aCanvas.getContext ('experimental-webgl') || aCanvas.getContext ('webkit-3d') || aCanvas.getContext ('moz-webgl');
			if (this.rc) {
				retorno= true;
				if (aConfiguraAutomaticamente)
					this.configurarShaderProgram ();
			}
			else
				this.erro= 'Seu navegador nao suporta WebGL';
		} 
		catch (e) {
			this.rc= 0;
			this.erro= e.message;
		}
		return retorno;
	}

	this.configurarShader= function (aVertex)

	{
		var retorno= 0;
		if (this.rc) {
			retorno= aVertex ? this.rc.createShader (this.rc.VERTEX_SHADER) : this.rc.createShader (this.rc.FRAGMENT_SHADER);
			var source= this.carregarShader (aVertex);
			this.rc.shaderSource (retorno, source);
			this.rc.compileShader (retorno);
			if (!this.rc.getShaderParameter (retorno, this.rc.COMPILE_STATUS)) {
				this.erro= this.rc.getShaderInfoLog (retorno);
				retorno= 0;
			}
		}
		return retorno;
	}

	this.configurarShaderProgram= function ()

	{
		if (this.rc) {
			this.shaderProgram= this.rc.createProgram ();
			this.rc.attachShader (this.shaderProgram, this.configurarShader (true));
			this.rc.attachShader (this.shaderProgram, this.configurarShader (false));
			this.rc.linkProgram (this.shaderProgram);
			if (!this.rc.getProgramParameter (this.shaderProgram, this.rc.LINK_STATUS))
				this.erro= 'Erro no WebGLRenderingContext.linkProgram';
		}
	}

	this.obterAttribLocation= function (aTipo, aNome)

	{
		var retorno= 0;
		if (this.rc && this.shaderProgram) {
			var b= !aTipo || (aTipo == 'vertices') ? 0 : 1;
			this.rc.bindBuffer (this.rc.ARRAY_BUFFER, this.buffers[b]);
			retorno= this.rc.getAttribLocation (this.shaderProgram, aNome ? aNome : (b == 0 ? 'shaderVertexPosition' : 'shaderVertexColor'));
			this.rc.enableVertexAttribArray (retorno);
		}
		return retorno;
	}

	this.reservarBuffer= function (aTipo, aVertices)

	{
		if (this.rc) {
			var b= !aTipo || (aTipo == 'vertices') ? 0 : 1;
			this.buffers[b]= this.rc.createBuffer ();
			this.attributes[b]= this.obterAttribLocation (aTipo);
			this.rc.bufferData (this.rc.ARRAY_BUFFER, aVertices, this.rc.STATIC_DRAW);
		}
	}

	this.selecionarBuffer= function (aTipo)

	{
		if (this.rc) {
			var b= !aTipo || (aTipo == 'vertices') ? 0 : 1;
			this.rc.bindBuffer (this.rc.ARRAY_BUFFER, this.buffers[b]);
			this.rc.vertexAttribPointer (this.attributes[b], (b == 0) ? 3 : 4, this.rc.FLOAT, false, 0, 0);
		}
	}
}