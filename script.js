let saldo = 0;
let tulot = 0;
let menot = 0;

const tulotElementti = document.getElementById("tulot");
const menotElementti = document.getElementById("menot");
const saldoElementti = document.getElementById("saldo");
const tapahtumat = document.getElementById("tapahtumat");

function paivitaSaldo() {
    saldoElementti.textContent = saldo + " €";
    tulotElementti.textContent = tulot + " €";
    menotElementti.textContent = menot + " €";
}
function lisaaTulo() {
    let summa = Number(prompt("Anna tulon määrä (€):"));

    if (!isNaN(summa) && summa > 0) {
        tulot+= summa;
        saldo+=summa;
        paivitaSaldo();

        let uusi = document.createElement("li");
        uusi.textContent = "+ " + summa + " €";
        uusi.style.color = "green";

        tapahtumat.appendChild(uusi);
    }
}

function lisaaMeno() {
    let summa = Number(prompt("Anna menon määrä (€):"));

    if (!isNaN(summa) && summa > 0) {
        menot += summa;
        saldo -= summa;
        paivitaSaldo();

        let uusi = document.createElement("li");
        uusi.textContent = "- " + summa + " €";
        uusi.style.color = "red";

        tapahtumat.appendChild(uusi);
    }
}

paivitaSaldo();