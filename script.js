let saldo = 0;

function paivitaSaldo() {
    document.getElementById("saldo").textContent = saldo + " €";
}

function lisaaTulo() {
    let summa = Number(prompt("Anna tulon määrä (€):"));

    if (!summa) return;

    saldo += summa;

    let lista = document.getElementById("tapahtumat");
    lista.innerHTML += `<li>💵 Tulo +${summa} €</li>`;

    paivitaSaldo();
}

function lisaaMeno() {
    let summa = Number(prompt("Anna menon määrä (€):"));

    if (!summa) return;

    saldo -= summa;

    let lista = document.getElementById("tapahtumat");
    lista.innerHTML += `<li>💸 Meno -${summa} €</li>`;

    paivitaSaldo();
}