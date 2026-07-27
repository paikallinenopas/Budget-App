// ========================================
// Budget App v2.0
// Osa 1/4
// ========================================

// -------------------------------
// DOM
// -------------------------------

const saldoElementti = document.getElementById("saldo");
const tulotElementti = document.getElementById("tulot");
const menotElementti = document.getElementById("menot");
const saastoElementti = document.getElementById("saasto");
const maaraElementti = document.getElementById("maara");

const lista = document.getElementById("tapahtumat");

const nimiInput = document.getElementById("nimi");
const summaInput = document.getElementById("summa");
const kategoriaInput = document.getElementById("kategoria");
const paivamaaraInput = document.getElementById("paivamaara");
const tyyppiInput = document.getElementById("tyyppi");

const hakuInput = document.getElementById("haku");

// -------------------------------
// Data
// -------------------------------

let tapahtumat =
    JSON.parse(localStorage.getItem("tapahtumat")) || [];

let muokattavaId = null;

// -------------------------------
// Tallennus
// -------------------------------

function tallenna() {

    localStorage.setItem(

        "tapahtumat",

        JSON.stringify(tapahtumat)

    );

}

// -------------------------------
// Tyhjennä lomake
// -------------------------------

function tyhjennaLomake(){

    nimiInput.value = "";

    summaInput.value = "";

    paivamaaraInput.value = "";

    kategoriaInput.selectedIndex = 0;

    tyyppiInput.selectedIndex = 0;

}

// -------------------------------
// Lisää tapahtuma
// -------------------------------

function lisaaTapahtuma(){

    const nimi = nimiInput.value.trim();

    const summa = Number(summaInput.value);

    const kategoria = kategoriaInput.value;

    const paivamaara = paivamaaraInput.value;

    const tyyppi = tyyppiInput.value;

    if(nimi===""){

        alert("Anna tapahtuman nimi.");

        return;

    }

    if(summa<=0){

        alert("Anna kelvollinen summa.");

        return;

    }

    const tapahtuma={

        id:
            muokattavaId ?? Date.now(),

        nimi,

        summa,

        kategoria,

        paivamaara,

        tyyppi

    };

    if(muokattavaId){

        const indeksi =
            tapahtumat.findIndex(

                t=>t.id===muokattavaId

            );

        tapahtumat[indeksi]=tapahtuma;

        muokattavaId=null;

    }else{

        tapahtumat.push(tapahtuma);

    }

    tallenna();

    tyhjennaLomake();

    piirraTapahtumat();

    paivitaYhteenveto();

}

// ========================================
// Budget App v2.0
// Osa 2/4
// ========================================

// -------------------------------
// Piirrä tapahtumat
// -------------------------------

function piirraTapahtumat() {

    lista.innerHTML = "";

    tapahtumat.forEach(t => {

        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        li.innerHTML = `

            <div>

                <strong>${t.nimi}</strong><br>

                <small>

                    ${t.kategoria} • ${t.paivamaara}

                </small>

            </div>

            <div style="display:flex;align-items:center;gap:10px;">

                <strong style="color:${t.tyyppi === "tulo" ? "#16a34a" : "#dc2626"}">

                    ${t.tyyppi === "tulo" ? "+" : "-"}${t.summa.toLocaleString("fi-FI")} €

                </strong>

                <button onclick="muokkaaTapahtuma(${t.id})">

                    ✏️

                </button>

                <button onclick="poistaTapahtuma(${t.id})">

                    🗑️

                </button>

            </div>

        `;

        lista.appendChild(li);

    });

}

// -------------------------------
// Poista tapahtuma
// -------------------------------

function poistaTapahtuma(id) {

    if (!confirm("Poistetaanko tapahtuma?")) {

        return;

    }

    tapahtumat = tapahtumat.filter(

        t => t.id !== id

    );

    tallenna();

    piirraTapahtumat();

    paivitaYhteenveto();

    paivitaKaaviot();

}

// -------------------------------
// Muokkaa tapahtumaa
// -------------------------------

function muokkaaTapahtuma(id) {

    const t = tapahtumat.find(

        x => x.id === id

    );

    if (!t) return;

    muokattavaId = id;

    nimiInput.value = t.nimi;

    summaInput.value = t.summa;

    kategoriaInput.value = t.kategoria;

    paivamaaraInput.value = t.paivamaara;

    tyyppiInput.value = t.tyyppi;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ========================================
// Budget App v2.0
// Osa 3/4
// ========================================

// -------------------------------
// Päivitä yhteenveto
// -------------------------------

function paivitaYhteenveto() {

    let tulot = 0;
    let menot = 0;

    tapahtumat.forEach(t => {

        if (t.tyyppi === "tulo") {
            tulot += t.summa;
        } else {
            menot += t.summa;
        }

    });

    const saldo = tulot - menot;

    saldoElementti.textContent =
        saldo.toLocaleString("fi-FI") + " €";

    tulotElementti.textContent =
        tulot.toLocaleString("fi-FI") + " €";

    menotElementti.textContent =
        menot.toLocaleString("fi-FI") + " €";

    if (saastoElementti) {

        saastoElementti.textContent =
            saldo.toLocaleString("fi-FI") + " €";

    }

    if (maaraElementti) {

        maaraElementti.textContent =
            tapahtumat.length;

    }

}

// -------------------------------
// Hakutoiminto
// -------------------------------

if (hakuInput) {

    hakuInput.addEventListener("input", function () {

        const haku = this.value.toLowerCase();

        document.querySelectorAll("#tapahtumat li")
            .forEach(rivi => {

                if (rivi.innerText.toLowerCase().includes(haku)) {

                    rivi.style.display = "flex";

                } else {

                    rivi.style.display = "none";

                }

            });

    });

}

// -------------------------------
// Enter lisää tapahtuman
// -------------------------------

summaInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        lisaaTapahtuma();

    }

});

// -------------------------------
// Alustus
// -------------------------------

piirraTapahtumat();

paivitaYhteenveto();

// ========================================
// Budget App v2.0
// Osa 4/4
// ========================================

// -------------------------------
// Lajittele tapahtumat päivämäärän mukaan
// -------------------------------

function lajitteleTapahtumat() {

    tapahtumat.sort((a, b) => {

        if (!a.paivamaara || !b.paivamaara) {

            return b.id - a.id;

        }

        return new Date(b.paivamaara) - new Date(a.paivamaara);

    });

}

// -------------------------------
// Päivitä kaikki näkymät
// -------------------------------

function paivitaKaikki() {

    lajitteleTapahtumat();

    piirraTapahtumat();

    paivitaYhteenveto();
    paivitaTavoite();

    tallenna();

}

// -------------------------------
// Vie tiedot JSON-tiedostoksi
// -------------------------------

function vieJSON() {

    const data = JSON.stringify(tapahtumat, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const linkki = document.createElement("a");

    linkki.href = url;
    linkki.download = "budget-data.json";

    linkki.click();

    URL.revokeObjectURL(url);

}

// -------------------------------
// Tyhjennä kaikki tiedot
// -------------------------------

function tyhjennaKaikki() {

    if (!confirm("Haluatko varmasti poistaa kaikki tapahtumat?")) {

        return;

    }

    tapahtumat = [];

    muokattavaId = null;

    tallenna();

    paivitaKaikki();

}

// -------------------------------
// Näytä tämän kuukauden saldo
// -------------------------------

function tamanKuukaudenSaldo() {

    const nyt = new Date();

    const vuosi = nyt.getFullYear();
    const kuukausi = nyt.getMonth();

    let saldo = 0;

    tapahtumat.forEach(t => {

        if (!t.paivamaara) return;

        const p = new Date(t.paivamaara);

        if (
            p.getFullYear() === vuosi &&
            p.getMonth() === kuukausi
        ) {

            if (t.tyyppi === "tulo") {

                saldo += t.summa;

            } else {

                saldo -= t.summa;

            }

        }

    });

    return saldo;

}

// -------------------------------
// Käynnistys
// -------------------------------

paivitaKaikki();

console.log("Budget App käynnistetty onnistuneesti.");

// ===============================
// KUUKAUSITAVOITTEET
// ===============================

let kuukausiTavoite =
    Number(localStorage.getItem("kuukausiTavoite")) || 0;

function tallennaTavoite() {

    const arvo = Number(
        document.getElementById("tavoite").value
    );

    if (arvo <= 0) {

        alert("Anna kelvollinen tavoite.");

        return;

    }

    kuukausiTavoite = arvo;

    localStorage.setItem(
        "kuukausiTavoite",
        kuukausiTavoite
    );

function paivitaTavoite() {

    const teksti = document.getElementById("tavoiteTeksti");
    const progress = document.getElementById("progressBar");
    const prosentti = document.getElementById("progressProsentti");

    if (!teksti || !progress || !prosentti) return;

    if (kuukausiTavoite <= 0) {

        teksti.textContent = "Tavoitetta ei ole asetettu.";
        progress.style.width = "0%";
        prosentti.textContent = "0 %";

        return;
    }

    const saldo = tapahtumat.reduce((summa, t) => {

        return t.tyyppi === "tulo"
            ? summa + t.summa
            : summa - t.summa;

    }, 0);

    let edistyminen = (saldo / kuukausiTavoite) * 100;

    if (edistyminen < 0) edistyminen = 0;
    if (edistyminen > 100) edistyminen = 100;

    teksti.textContent =
        `Tavoite: ${kuukausiTavoite.toLocaleString("fi-FI")} €`;

    progress.style.width = edistyminen + "%";

    prosentti.textContent =
        `${edistyminen.toFixed(0)} %`;

    // Väri edistymisen mukaan
    if (edistyminen < 40) {

        progress.style.background = "#ef4444";

    } else if (edistyminen < 80) {

        progress.style.background = "#f59e0b";

    } else {

        progress.style.background = "#22c55e";

    }

    }
}

// ===============================
// CHART.JS
// ===============================

let saldoChart;
let kategoriaChart;
let tulotMenotChart;

function paivitaKaaviot() {

    // Tuhoa vanhat kaaviot

    if (saldoChart) saldoChart.destroy();
    if (kategoriaChart) kategoriaChart.destroy();
    if (tulotMenotChart) tulotMenotChart.destroy();

    // -------------------------
    // SALDON KEHITYS
    // -------------------------

    let saldo = 0;

    const saldot = [];
    const paivat = [];

    tapahtumat.forEach(t => {

        if (t.tyyppi === "tulo") {

            saldo += t.summa;

        } else {

            saldo -= t.summa;

        }

        saldot.push(saldo);

        paivat.push(t.paivamaara || "");

    });

    saldoChart = new Chart(

        document.getElementById("saldoChart"),

        {

            type: "line",

            data: {

                labels: paivat,

                datasets: [{

                    label: "Saldo",

                    data: saldot,

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false

                }]

            }

        }

    );

    // -------------------------
    // MENOT KATEGORIOITTAIN
    // -------------------------

    const kategoriat = {};

    tapahtumat.forEach(t => {

        if (t.tyyppi === "meno") {

            if (!kategoriat[t.kategoria]) {

                kategoriat[t.kategoria] = 0;

            }

            kategoriat[t.kategoria] += t.summa;

        }

    });

    kategoriaChart = new Chart(

        document.getElementById("kategoriaChart"),

        {

            type: "pie",

            data: {

                labels: Object.keys(kategoriat),

                datasets: [{

                    data: Object.values(kategoriat)

                }]

            }

        }

    );
    
    // -------------------------
    // TULOT VS MENOT
    // -------------------------

    let tulot = 0;
    let menot = 0;

    tapahtumat.forEach(t => {

        if (t.tyyppi === "tulo") {

            tulot += t.summa;

        } else {

            menot += t.summa;

        }

    });

    tulotMenotChart = new Chart(

        document.getElementById("tulotMenotChart"),

        {

            type: "bar",

            data: {

                labels: ["Tulot", "Menot"],

                datasets: [{

                    data: [tulot, menot]

                }]

            }

        }

    );

}

paivitaKaaviot();

