let saldo = 0;
let tulot = 0;
let menot = 0;
let tallennetut = JSON.parse(localStorage.getItem("budgetData"));

if (tallennetut) {
    saldo = tallennetut.saldo;
    tulot = tallennetut.tulot;
    menot = tallennetut.menot;
}
const tulotElementti = document.getElementById("tulot");
const menotElementti = document.getElementById("menot");
const saldoElementti = document.getElementById("saldo");
const tapahtumat = document.getElementById("tapahtumat");

function tallennaTiedot() {
    localStorage.setItem("budgetData", JSON.stringify({
        saldo: saldo,
        tulot: tulot,
        menot: menot
    }));
}

function paivitaSaldo() {
    saldoElementti.textContent = saldo + " €";
    tulotElementti.textContent = tulot + " €";
    menotElementti.textContent = menot + " €";

    tallennaTiedot();
 }   

function lisaaTulo() {
    let summa = Number(prompt("Anna tulon määrä (€):"));

    if (!isNaN(summa) && summa > 0) {
        tulot += summa;
        saldo +=summa;
        paivitaSaldo();

        let uusi = document.createElement("li");
        const aika = new Date().toLocaleString("fi-FI");

        uusi.textContent = "+ " + summa + " €  •  " + aika;
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
        const aika = new Date().toLocaleString("fi-FI");

        uusi.textContent = "- " + summa + " € • " + aika;
        uusi.style.color = "red";

        tapahtumat.appendChild(uusi);
    }
}

paivitaSaldo();
// ===============================
// TAPAHTUMAT
// ===============================

let tapahtumat = JSON.parse(localStorage.getItem("tapahtumat")) || [];

function lisaaTapahtuma() {

    const nimi = document.getElementById("nimi").value.trim();

    const summa = Number(document.getElementById("summa").value);

    const kategoria = document.getElementById("kategoria").value;

    const paivamaara = document.getElementById("paivamaara").value;

    const tyyppi = document.getElementById("tyyppi").value;

    if (nimi === "" || summa <= 0) {

        alert("Täytä nimi ja summa.");

        return;

    }

    const tapahtuma = {

        id: Date.now(),

        nimi,

        summa,

        kategoria,

        paivamaara,

        tyyppi

    };

    tapahtumat.push(tapahtuma);

    localStorage.setItem(
        "tapahtumat",
        JSON.stringify(tapahtumat)
    );

    piirraTapahtumat();

    tyhjennaLomake();

}