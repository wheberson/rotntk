// Copyright (c) 2017 Wheberson Migueletti - http://programacao.wheberson.com.br
// Licensed under The MIT License - http://www.opensource.org/licenses/mit-license.php

function Operador3D ()

{
}

// Graus -> Radianos
Operador3D.prototype.cnvGrausParaRadianos= function (aValor)

{
	return (aValor*Math.PI)/180;
}

// Produto vetorial: u x v
// https://en.wikipedia.org/wiki/Cross_product
Operador3D.prototype.cross= function (aU, aV)

{
	var retorno= this.reservar (4);
	retorno[0]= aU[1]*aV[2] - aU[2]*aV[1];
	retorno[1]= aU[2]*aV[0] - aU[0]*aV[2];
	retorno[2]= aU[0]*aV[1] - aU[1]*aV[0];
	retorno[3]= 1;
	return retorno;
}

Operador3D.prototype.escalar= function (aMatriz, aVetor)

{
	var m= this.obterIdentidade ();
	m[ 0]= aVetor[0];
	m[ 5]= aVetor[1];
	m[10]= aVetor[2];
	return this.multiplicar (m, aMatriz);
}

Operador3D.prototype.multiplicar= function (aMatrizA, aMatrizB)

{
	var retorno= this.reservar (16);
	for (var i= 0; i < 4; i++)
		for (var j= 0; j < 4; j++)
			retorno[i*4 + j]= 	aMatrizA[i*4 + 0]*aMatrizB[0*4 + j] + 
								aMatrizA[i*4 + 1]*aMatrizB[1*4 + j] +
								aMatrizA[i*4 + 2]*aMatrizB[2*4 + j] +
								aMatrizA[i*4 + 3]*aMatrizB[3*4 + j];
	return retorno;
}

Operador3D.prototype.multiplicarPorVetor= function (aMatriz, aVetor)

{
	var retorno= this.reservar (4);
	var w= aVetor.length <= 3 ? 1 : aVetor[3];
	for (var j= 0; j < 4; j++)
		retorno[j]= aMatriz[0*4 + j]*aVetor[0] + 
					aMatriz[1*4 + j]*aVetor[1] + 
					aMatriz[2*4 + j]*aVetor[2] + 
					aMatriz[3*4 + j]*w;
	return retorno;
}

Operador3D.prototype.normalizar= function (aVetor)

{
	var retorno= this.reservar (4);
	var c= aVetor[0]*aVetor[0] + aVetor[1]*aVetor[1] + aVetor[2]*aVetor[2];
	if (c != 0) {
		c= 1/Math.sqrt (c);
		retorno[0]= aVetor[0]*c;
		retorno[1]= aVetor[1]*c;
		retorno[2]= aVetor[2]*c;
		retorno[3]= 1;
	}
	else {
		retorno[0]= aVetor[0];
		retorno[1]= aVetor[1];
		retorno[2]= aVetor[2];
		retorno[3]= aVetor.length <= 3 ? 1 : aVetor[3];
	}
	return retorno;
}

Operador3D.prototype.olharPara= function (aEye, aAt, aUp)

{
	var m= this.reservar (16);
	var f= this.normalizar ([aAt[0]-aEye[0], aAt[1]-aEye[1], aAt[2]-aEye[2]]);
	var s= this.normalizar (this.cross (f, aUp));
	var u= this.cross (s, f);
	m[ 0]= s[0]; m[ 4]= u[0]; m[ 8]= -f[0]; m[12]= 0;
	m[ 1]= s[1]; m[ 5]= u[1]; m[ 9]= -f[1]; m[13]= 0;
	m[ 2]= s[2]; m[ 6]= u[2]; m[10]= -f[2]; m[14]= 0;
	m[ 3]= 0;    m[ 7]= 0;    m[11]= 0;     m[15]= 1;
	return this.transladar (m, [-aEye[0], -aEye[1], -aEye[2]]);
}

// [Column-major order] Secao 2.11.2: https://www.khronos.org/registry/OpenGL/specs/gl/glspec21.pdf
Operador3D.prototype.obterIdentidade= function ()

{
	var retorno= this.reservar (16);
	retorno[ 0]= 1; retorno[ 4]= 0; retorno[ 8]= 0; retorno[12]= 0;
	retorno[ 1]= 0; retorno[ 5]= 1; retorno[ 9]= 0; retorno[13]= 0;
	retorno[ 2]= 0; retorno[ 6]= 0; retorno[10]= 1; retorno[14]= 0;
	retorno[ 3]= 0; retorno[ 7]= 0; retorno[11]= 0; retorno[15]= 1;
	return retorno;
}

// Left-handed
Operador3D.prototype.obterPerspectivaLH= function (aFOVY, aAspect, aZNear, aZFar)

{
	var retorno= this.reservar (16);
	var angulo= this.cnvGrausParaRadianos (aFOVY/2);
	var sen= Math.sin (angulo);
	var d= aZFar-aZNear;
	if ((d != 0) && (sen != 0) && (aAspect != 0)) {
		var cot= Math.cos (angulo) / sen;
		retorno[ 0]= cot/aAspect;	retorno[ 4]= 0;		retorno[ 8]= 0;					retorno[12]= 0;
		retorno[ 1]= 0;				retorno[ 5]= cot;	retorno[ 9]= 0;					retorno[13]= 0;
		retorno[ 2]= 0;				retorno[ 6]= 0;		retorno[10]= aZFar/d;			retorno[14]= 1;
		retorno[ 3]= 0;				retorno[ 7]= 0;		retorno[11]= -(aZNear*aZFar)/d;	retorno[15]= 0;
	}
	return retorno;
};

// Right-handed
Operador3D.prototype.obterPerspectiva= function (aFOVY, aAspect, aZNear, aZFar)

{
	var retorno= this.reservar (16);
	var angulo= this.cnvGrausParaRadianos (aFOVY/2);
	var sen= Math.sin (angulo);
	var d= aZNear-aZFar;
	if ((d != 0) && (sen != 0) && (aAspect != 0)) {
		var cot= Math.cos (angulo) / sen;
		retorno[ 0]= cot/aAspect;	retorno[ 4]= 0;		retorno[ 8]= 0;						retorno[12]= 0;
		retorno[ 1]= 0;				retorno[ 5]= cot;	retorno[ 9]= 0;						retorno[13]= 0;
		retorno[ 2]= 0;				retorno[ 6]= 0;		retorno[10]= (aZNear+aZFar)/d;		retorno[14]= -1;
		retorno[ 3]= 0;				retorno[ 7]= 0;		retorno[11]= (2*aZNear*aZFar)/d;	retorno[15]= 0;

	}
	return retorno;
};

Operador3D.prototype.poderNormalizar= function (aVetor)

{
	return (aVetor[0]*aVetor[0] + aVetor[1]*aVetor[1] + aVetor[2]*aVetor[2]) != 0;
}

Operador3D.prototype.reservar= function (aValor)

{
	return typeof Float32Array !== 'undefined' ? new Float32Array (aValor) : new Array (aValor);
}

// https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
Operador3D.prototype.rotacionar= function (aMatriz, aAngulo, aVetor)

{
	var retorno;
	if (!this.poderNormalizar (aVetor))
		retorno= this.obterIdentidade ();
	else {
		var m= this.reservar (16);
		var angulo= this.cnvGrausParaRadianos (aAngulo);
		var cos= Math.cos (angulo);
		var sen= Math.sin (angulo);
		var u= this.normalizar (aVetor);
		var t= 1 - cos;
		m[ 0]= cos + u[0]*u[0]*t;		m[ 4]= u[0]*u[1]*t - u[2]*sen;	m[ 8]= u[0]*u[2]*t + u[1]*sen;	m[12]= 0;
		m[ 1]= u[1]*u[0]*t + u[2]*sen;	m[ 5]= cos + u[1]*u[1]*t;		m[ 9]= u[1]*u[2]*t - u[0]*sen;	m[13]= 0;
		m[ 2]= u[2]*u[0]*t - u[1]*sen;	m[ 6]= u[2]*u[1]*t + u[0]*sen;  m[10]= cos + u[2]*u[2]*t;		m[14]= 0;
		m[ 3]= 0;						m[ 7]= 0;                       m[11]= 0;						m[15]= 1;
		retorno= this.multiplicar (m, aMatriz);
	}
	return retorno;
}

Operador3D.prototype.transladar= function (aMatriz, aVetor)

{
	var m= this.obterIdentidade ();
	m[12]= aVetor[0];
	m[13]= aVetor[1];
	m[14]= aVetor[2];
	return this.multiplicar (m, aMatriz);
}

Operador3D.prototype.visualizar= function (aMatriz, aVertice)

{
	var retorno= this.multiplicarPorVetor (aMatriz, aVertice);

	// Homogeniza
		retorno[0]= retorno[0]/retorno[3];
		retorno[1]= retorno[1]/retorno[3];
		retorno[2]= retorno[2]/retorno[3];

	// Mapeia x, y, z para o intervalo 0 a 1
		retorno[0]= 0.5 + retorno[0]*0.5;
		retorno[1]= 0.5 + retorno[1]*0.5;
		retorno[2]= 0.5 + retorno[2]*0.5;
	return retorno;
}