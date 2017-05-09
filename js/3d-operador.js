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
	var matrizTranslacao= this.obterIdentidade ();
	matrizTranslacao[ 0]= aVetor[0];
	matrizTranslacao[ 5]= aVetor[1];
	matrizTranslacao[10]= aVetor[2];
	return this.multiplicar (matrizTranslacao, aMatriz);
}

Operador3D.prototype.multiplicar= function (aA, aB)

{
	var retorno= this.reservar (16);
	var i00=  0, i01=  1, i02=  2, i03=  3;
	var i10=  4, i11=  5, i12=  6, i13=  7;
	var i20=  8, i21=  9, i22= 10, i23= 11;
	var i30= 12, i31= 13, i32= 14, i33= 15;

	retorno[i00]= aA[i00]*aB[i00] + aA[i01]*aB[i10] + aA[i02]*aB[i20] + aA[i03]*aB[i30];
	retorno[i01]= aA[i00]*aB[i01] + aA[i01]*aB[i11] + aA[i02]*aB[i21] + aA[i03]*aB[i31];
	retorno[i02]= aA[i00]*aB[i02] + aA[i01]*aB[i12] + aA[i02]*aB[i22] + aA[i03]*aB[i32];
	retorno[i03]= aA[i00]*aB[i03] + aA[i01]*aB[i13] + aA[i02]*aB[i23] + aA[i03]*aB[i33];

	retorno[i10]= aA[i10]*aB[i00] + aA[i11]*aB[i10] + aA[i12]*aB[i20] + aA[i13]*aB[i30];
	retorno[i11]= aA[i10]*aB[i01] + aA[i11]*aB[i11] + aA[i12]*aB[i21] + aA[i13]*aB[i31];
	retorno[i12]= aA[i10]*aB[i02] + aA[i11]*aB[i12] + aA[i12]*aB[i22] + aA[i13]*aB[i32];
	retorno[i13]= aA[i10]*aB[i03] + aA[i11]*aB[i13] + aA[i12]*aB[i23] + aA[i13]*aB[i33];

	retorno[i20]= aA[i20]*aB[i00] + aA[i21]*aB[i10] + aA[i22]*aB[i20] + aA[i23]*aB[i30];
	retorno[i21]= aA[i20]*aB[i01] + aA[i21]*aB[i11] + aA[i22]*aB[i21] + aA[i23]*aB[i31];
	retorno[i22]= aA[i20]*aB[i02] + aA[i21]*aB[i12] + aA[i22]*aB[i22] + aA[i23]*aB[i32];
	retorno[i23]= aA[i20]*aB[i03] + aA[i21]*aB[i13] + aA[i22]*aB[i23] + aA[i23]*aB[i33];

	retorno[i30]= aA[i30]*aB[i00] + aA[i31]*aB[i10] + aA[i32]*aB[i20] + aA[i33]*aB[i30];
	retorno[i31]= aA[i30]*aB[i01] + aA[i31]*aB[i11] + aA[i32]*aB[i21] + aA[i33]*aB[i31];
	retorno[i32]= aA[i30]*aB[i02] + aA[i31]*aB[i12] + aA[i32]*aB[i22] + aA[i33]*aB[i32];
	retorno[i33]= aA[i30]*aB[i03] + aA[i31]*aB[i13] + aA[i32]*aB[i23] + aA[i33]*aB[i33];

	return retorno;
}

Operador3D.prototype.multiplicarPorVetor= function (aMatriz, aVetor)

{
	var retorno= this.reservar (4);
	var w= aVetor.length <= 3 ? 1 : aVetor[3];
	retorno[0]= aMatriz[ 0]*aVetor[0] + aMatriz[ 1]*aVetor[1] + aMatriz[ 2]*aVetor[2] + aMatriz[ 3]*w;
	retorno[1]= aMatriz[ 4]*aVetor[0] + aMatriz[ 5]*aVetor[1] + aMatriz[ 6]*aVetor[2] + aMatriz[ 7]*w;
	retorno[2]= aMatriz[ 8]*aVetor[0] + aMatriz[ 9]*aVetor[1] + aMatriz[10]*aVetor[2] + aMatriz[11]*w;
	retorno[3]= aMatriz[12]*aVetor[0] + aMatriz[13]*aVetor[1] + aMatriz[14]*aVetor[2] + aMatriz[15]*w;
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
	m[ 0]=  s[0]; m[ 1]=  s[1]; m[ 2]=  s[2]; m[ 3]= 0;
	m[ 4]=  u[0]; m[ 5]=  u[1]; m[ 6]=  u[2]; m[ 7]= 0;
	m[ 8]= -f[0]; m[ 9]= -f[1]; m[10]= -f[2]; m[11]= 0;
	m[12]=     0; m[13]=     0; m[14]=     0; m[15]= 1;
	return this.transladar (m, [-aEye[0], -aEye[1], -aEye[2]]);
}

Operador3D.prototype.obterIdentidade= function ()

{
	var retorno= this.reservar (16);
	retorno[ 0]= 1; retorno[ 1]= 0; retorno[ 2]= 0; retorno[ 3]= 0;
	retorno[ 4]= 0; retorno[ 5]= 1; retorno[ 6]= 0; retorno[ 7]= 0;
	retorno[ 8]= 0; retorno[ 9]= 0; retorno[10]= 1; retorno[11]= 0;
	retorno[12]= 0; retorno[13]= 0; retorno[14]= 0; retorno[15]= 1;
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
		retorno[ 0]= cot/aAspect;	retorno[ 1]= 0;		retorno[ 2]= 0;			retorno[ 3]= 0;
		retorno[ 4]= 0;				retorno[ 5]= cot;	retorno[ 6]= 0;			retorno[ 7]= 0;
		retorno[ 8]= 0;				retorno[ 9]= 0;		retorno[10]= aZFar/d;	retorno[11]= -(aZNear*aZFar)/d;
		retorno[12]= 0;				retorno[13]= 0;		retorno[14]= 1;			retorno[15]= 0;
	}
    return retorno;
};

// Right-handed
Operador3D.prototype.obterPerspectiva= function (aFOVY, aAspect, aZNear, aZFar)

{
	var retorno= this.reservar (16);
    var angulo= this.cnvGrausParaRadianos (aFOVY/2);
    var sen= Math.sin (angulo);
    var d= aZFar-aZNear;
    if ((d != 0) && (sen != 0) && (aAspect != 0)) {
		var cot= Math.cos (angulo) / sen;
		retorno[ 0]= cot/aAspect;	retorno[ 1]= 0;		retorno[ 2]= 0;					retorno[ 3]= 0;
		retorno[ 4]= 0;				retorno[ 5]= cot;	retorno[ 6]= 0;					retorno[ 7]= 0;
		retorno[ 8]= 0;				retorno[ 9]= 0;		retorno[10]= -(aZNear+aZFar)/d;	retorno[11]= -(2*aZNear*aZFar)/d;
		retorno[12]= 0;				retorno[13]= 0;		retorno[14]= -1;				retorno[15]= 0;
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
		var matrizRotacao= this.reservar (16);
		var angulo= this.cnvGrausParaRadianos (aAngulo);
		var cos= Math.cos (angulo);
		var sen= Math.sin (angulo);
		var u= this.normalizar (aVetor);
		var t= 1 - cos;

		matrizRotacao[ 0]= cos + u[0]*u[0]*t;		matrizRotacao[ 1]= u[0]*u[1]*t - u[2]*sen;	matrizRotacao[ 2]= u[0]*u[2]*t + u[1]*sen;	matrizRotacao[ 3]= 0;
		matrizRotacao[ 4]= u[1]*u[0]*t + u[2]*sen;	matrizRotacao[ 5]= cos + u[1]*u[1]*t;		matrizRotacao[ 6]= u[1]*u[2]*t - u[0]*sen;	matrizRotacao[ 7]= 0;
		matrizRotacao[ 8]= u[2]*u[0]*t - u[1]*sen;	matrizRotacao[ 9]= u[2]*u[1]*t + u[0]*sen;	matrizRotacao[10]= cos + u[2]*u[2]*t;		matrizRotacao[15]= 0;
		matrizRotacao[12]= 0;						matrizRotacao[13]= 0;						matrizRotacao[14]= 0;						matrizRotacao[15]= 1;

		retorno= this.multiplicar (matrizRotacao, aMatriz);
	}
	return retorno;
}

Operador3D.prototype.transladar= function (aMatriz, aVetor)

{
	var matrizTranslacao= this.obterIdentidade ();
	matrizTranslacao[ 3]= aVetor[0];
	matrizTranslacao[ 7]= aVetor[1];
	matrizTranslacao[11]= aVetor[2];
	return this.multiplicar (matrizTranslacao, aMatriz);
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