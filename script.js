let saldo = 0;

const saldoElementti = document.getElementById("saldo");
const tapahtumat = document.getElementById("tapahtumat");

function paivitaSaldo() {
    saldoElementti.textContent = saldo + " €";
}

function lisaaTulo() {
    let summa = Number(prompt("Anna tulon määrä (€):"));

    if (!isNaN(summa) && summa > 0) {
        saldo += summa;
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
        saldo -= summa;
        paivitaSaldo();

        let uusi = document.createElement("li");
        uusi.textContent = "- " + summa + " €";
        uusi.style.color = "red";

        tapahtumat.appendChild(uusi);
    }
}

paivitaSaldo();