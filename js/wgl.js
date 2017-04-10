// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function WebGL ()

{
	this.aoCarregarShader= '';
	this.canvas= 0;
	this.erro= '';
	this.rc= 0;
	this.shaderPadrao= ['vec4 (shaderVertexPosition, 1.0)', 'vec4 (1.0, 1.0, 1.0, 1.0)'];
	this.shaderProgram= 0;

	this.carregarShader= function (aVertex)

	{
		var retorno= '';
		if (typeof this.aoCarregarShader == 'function')
			retorno= this.aoCarregarShader (aVertex);
		else if (aVertex)
			retorno= 'attribute vec3 shaderVertexPosition; void main () {gl_Position= ' + this.shaderPadrao[0] + ';}';
		else
			retorno= 'void main () {gl_FragColor= ' + this.shaderPadrao[1] + ';}';
		return retorno;
	}

	this.configurar= function (aCanvas, aConfiguraAutomaticamente)

	{
		this.canvas= aCanvas;
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

	this.obterAttribLocation= function (aNome)

	{
		var retorno= 0;
		if (this.rc && this.shaderProgram) {
			retorno= this.rc.getAttribLocation (this.shaderProgram, aNome ? aNome : 'shaderVertexPosition');
			this.rc.enableVertexAttribArray (retorno);
		}
		return retorno;
	}
}