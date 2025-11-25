let a = prompt("Entrez le premier nombre :");
let b = prompt("Entrez le deuxième nombre :");
let op = prompt("Quelle opération voulez-vous faire ? (+, -, *, /)");

a = parseFloat(a);
b = parseFloat(b);

if (op == "+") {
    document.writeln("Le résultat est : " + (a + b));
}
else if (op == "-") {
    document.writeln("Le résultat est : " + (a - b));
}
else if (op == "*") {
    document.writeln("Le résultat est : " + (a * b));
}
else if (op == "/") {
    document.writeln("Le résultat est : " + (a / b));
}
else {
    document.writeln("Opération invalide !");
}
