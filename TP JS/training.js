function somme (){

    var a = document.getElementById("t1").value;
    var b = document.getElementById("t2").value;
    var c = Number(a) + Number(b);
    document.getElementById("résultat").value = c;


}

function addition() {
    var a = Number(document.getElementById("t1").value);
    var b = Number(document.getElementById("t2").value);
    document.getElementById("résultat").value = a + b;

}

function soustraction() {
    var a = Number(document.getElementById("t1").value);
    var b = Number(document.getElementById("t2").value);
    document.getElementById("résultat").value = a - b;
}

function multiplication() {
    var a = Number(document.getElementById("t1").value);
    var b = Number(document.getElementById("t2").value);
    document.getElementById("résultat").value = a * b;
}

function division() {
    var a = Number(document.getElementById("t1").value);
    var b = Number(document.getElementById("t2").value);
    if (b==0) {
        document.getElementById("résultat").value = "Erreur";
   } else {
        document.getElementById("résultat").value = a / b;
    }
}


function pair()
{
	var x = document.getElementById("résultat").value
	if (x % 2 ==0){
    	document.getElementById("pair").value = " Paire "
	}
	else{
    	document.getElementById("pair").value = " Impaire "
	}


}

function permuter() {
    var a = document.getElementById("t1").value;
    var b = document.getElementById("t2").value;
    document.getElementById("t1").value = b;
    document.getElementById("t2").value = a;

}

function effacer() {
    document.getElementById("t1").value = "";
    document.getElementById("t2").value = "";
    document.getElementById("résultat").value = "";
    document.getElementById("pair").value = "";
}

