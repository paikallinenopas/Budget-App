/*
=================================
FINERO 3.0
=================================
*/
console.log("script.js ladattu");

const SUPABASE_URL = "https://aaalfykbovslexndompa.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_G7z8XDhx1mZpeOSGqk9ONw_lWHxJ0y6";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function lataaTapahtumat() {
    const {
        data,
        error
    } = await sb
        .from("Transactions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    tapahtumat = data || [];

    paivitaKaikki();
}

async function tallennaTapahtumat() {
    const user = (await sb.auth.getUser()).data.user;

    if (!user) return;

    // Poista vanhat tapahtumat
    await sb
        .from("Transactions")
        .delete()
        .eq("user_id", user.id);

    // Lisää uudet tapahtumat
    const data = tapahtumat.map(t => ({
        user_id: user.id,
        description: t.nimi,
        amount: t.summa,
        category: t.kategoria,
        type: t.tyyppi,
        created_at: new Date().toISOString()
    }));

    if (data.length > 0) {
        const { error } = await sb
            .from("Transactions")
            .insert(data);

        if (error) {
            console.error(error);
        }
    }
}
//...
// Tämän jälkeen alkaa muu koodisi

let tapahtumat = [];

let incomeChart;
let expenseChart;
let categoryChart;
let historyChart;
let portfolioChart;
let saldoMiniChart;
let tulotMenotChart;

/* ======================================
   SIVUN VAIHTO
====================================== */

function naytaSivu(sivuId){

    document.querySelectorAll(".page").forEach(page=>{
        page.classList.remove("active");
    });

    const sivu = document.getElementById(sivuId);

    if(sivu){
        sivu.classList.add("active");
    }

}

/* ======================================
   LOCAL STORAGE
====================================== */

function tallenna(){
    tallennaTapahtumat();

}

/* ======================================
   APUTOIMINNOT
====================================== */

function euro(summa){

    return Number(summa).toLocaleString("fi-FI",{

        style:"currency",

        currency:"EUR"

    });

}

function paivitaKaikki(){

    paivitaSaldo();

    piirraTapahtumat();

    paivitaTilastot();

    piirraKaaviot();

}

/* ======================================
   KÄYNNISTYS
====================================== */

document.addEventListener("DOMContentLoaded",()=>{

    naytaSivu("etusivu");

    paivitaKaikki();

});
/* ======================================
   TAPAHTUMAT
====================================== */

function lisaaTapahtuma(){

    const nimi = document.getElementById("nimi").value.trim();
    const summa = Number(document.getElementById("summa").value);
    const tyyppi = document.getElementById("tyyppi").value;
    const kategoria = document.getElementById("kategoria").value;
    const paiva = document.getElementById("paivamaara").value;

    if(nimi==="" || !summa || !paiva){

        alert("Täytä kaikki kentät.");

        return;

    }

    tapahtumat.unshift({

        id:Date.now(),

        nimi,

        summa,

        tyyppi,

        kategoria,

        paiva,

        luotu:new Date().toLocaleString("fi-FI")

    });

    tallenna();

    paivitaKaikki();

    document.getElementById("nimi").value="";
    document.getElementById("summa").value="";
    document.getElementById("paiva").value="";

}

/* ======================================
   TAPAHTUMALISTA
====================================== */

function piirraTapahtumat(){

    const lista=document.getElementById("tapahtumalista");

    if(!lista) return;

    lista.innerHTML="";

    tapahtumat.forEach(t=>{

        const li=document.createElement("li");

        li.innerHTML=`

            <div>

                <strong>${t.nimi}</strong><br>

                <small>${t.kategoria} • ${t.paiva}</small>

            </div>

            <div>

                <strong class="${t.tyyppi==="Tulo"?"positive":"negative"}">

                    ${t.tyyppi==="Tulo"?"+":"-"}${euro(t.summa)}

                </strong>

                <br>

                <button onclick="muokkaaTapahtuma(${t.id})">

                    Muokkaa

                </button>

                <button onclick="poistaTapahtuma(${t.id})">

                    Poista

                </button>

            </div>

        `;

        lista.appendChild(li);

    });

}

/* ======================================
   POISTO
====================================== */

function poistaTapahtuma(id){

    if(!confirm("Poistetaanko tapahtuma?")) return;

    tapahtumat=tapahtumat.filter(t=>t.id!==id);

    tallenna();

    paivitaKaikki();

}

/* ======================================
   MUOKKAUS
====================================== */

function muokkaaTapahtuma(id){

    const t=tapahtumat.find(x=>x.id===id);

    if(!t) return;

    document.getElementById("nimi").value=t.nimi;
    document.getElementById("summa").value=t.summa;
    document.getElementById("tyyppi").value=t.tyyppi;
    document.getElementById("kategoria").value=t.kategoria;
    document.getElementById("paiva").value=t.paiva;

    tapahtumat=tapahtumat.filter(x=>x.id!==id);

    tallenna();

    paivitaKaikki();

}
/* ======================================
   SALDON JA KPI-KORTTIEN PÄIVITYS
====================================== */

function paivitaSaldo(){

    let tulot = 0;
    let menot = 0;

    tapahtumat.forEach(t=>{

        if(t.tyyppi==="Tulo"){
            tulot += Number(t.summa);
        }else{
            menot += Number(t.summa);
        }

    });

    const saldo = tulot - menot;

    const saldoEl = document.getElementById("saldo");
    const tulotEl = document.getElementById("tulot");
    const menotEl = document.getElementById("menot");
    const tapahtumatEl = document.getElementById("tapahtumienMaara");

    if(saldoEl){
        saldoEl.textContent = euro(saldo);
    }

    if(tulotEl){
        tulotEl.textContent = euro(tulot);
    }

    if(menotEl){
        menotEl.textContent = euro(menot);
    }

    if(tapahtumatEl){
        tapahtumatEl.textContent = tapahtumat.length;
    }

}

/* ======================================
   TILASTOKORTIT
====================================== */

function paivitaTilastot(){

    let tulot = 0;
    let menot = 0;

    tapahtumat.forEach(t=>{

        if(t.tyyppi==="Tulo"){
            tulot += Number(t.summa);
        }else{
            menot += Number(t.summa);
        }

    });

    const saldo = tulot - menot;

    const keskiarvo =
        tapahtumat.length > 0
        ? menot / tapahtumat.filter(t=>t.tyyppi==="Meno").length
        : 0;

    const saldoStat = document.getElementById("statSaldo");
    const tulotStat = document.getElementById("statTulot");
    const menotStat = document.getElementById("statMenot");
    const keskiStat = document.getElementById("statKeskiarvo");

    if(saldoStat){
        saldoStat.textContent = euro(saldo);
    }

    if(tulotStat){
        tulotStat.textContent = euro(tulot);
    }

    if(menotStat){
        menotStat.textContent = euro(menot);
    }

    if(keskiStat){
        keskiStat.textContent = euro(
            isFinite(keskiarvo) ? keskiarvo : 0
        );
    }

}

/* ======================================
   TAVOITTEEN ETENEMINEN
====================================== */

function paivitaTavoite(){

    const tavoite = Number(
        localStorage.getItem("kuukausitavoite")
    ) || 0;

    let menot = 0;

    tapahtumat.forEach(t=>{

        if(t.tyyppi==="Meno"){

            menot += Number(t.summa);

        }

    });

    const prosentti =
        tavoite > 0
        ? Math.min((menot / tavoite) * 100,100)
        : 0;

    const progress = document.querySelector(".progress-fill");

    if(progress){

        progress.style.width = prosentti + "%";

    }

    const tavoiteTeksti =
        document.getElementById("tavoiteProsentti");

    if(tavoiteTeksti){

        tavoiteTeksti.textContent =
            prosentti.toFixed(0) + "%";

    }

}

/* ======================================
   KAIKKI PÄIVITYKSET
====================================== */

function paivitaKaikki(){

    paivitaSaldo();

    piirraTapahtumat();

    paivitaTilastot();

    paivitaTavoite();

    piirraKaaviot();

}
/* ======================================
   CHART.JS
====================================== */

function piirraKaaviot(){

    piirraSaldoMiniChart();

    piirraTulotMenotChart();

    piirraKategoriatChart();

}

/* ======================================
   SALDOMINIKAAVIO
====================================== */

function piirraSaldoMiniChart(){

    const canvas=document.getElementById("saldoMiniChart");

    if(!canvas) return;

    let saldo=0;

    const historia=[];

    tapahtumat.slice().reverse().forEach(t=>{

        if(t.tyyppi==="Tulo"){
            saldo+=Number(t.summa);
        }else{
            saldo-=Number(t.summa);
        }

        historia.push(saldo);

    });

    if(saldoMiniChart){

        saldoMiniChart.destroy();

    }

    saldoMiniChart=new Chart(canvas,{

        type:"line",

        data:{

            labels:historia.map((_,i)=>i+1),

            datasets:[{

                data:historia,

                borderColor:"#22c55e",

                borderWidth:3,

                fill:false,

                tension:.4,

                pointRadius:0

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                x:{
                    display:false
                },

                y:{
                    display:false
                }

            }

        }

    });

}

/* ======================================
   TULOT VS MENOT
====================================== */

function piirraTulotMenotChart(){

    const canvas=document.getElementById("tulotMenotChart");

    if(!canvas) return;

    let tulot=0;

    let menot=0;

    tapahtumat.forEach(t=>{

        if(t.tyyppi==="Tulo"){

            tulot+=Number(t.summa);

        }else{

            menot+=Number(t.summa);

        }

    });

    if(tulotMenotChart){

        tulotMenotChart.destroy();

    }

    tulotMenotChart=new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:["Tulot","Menot"],

            datasets:[{

                data:[tulot,menot],

                backgroundColor:[

                    "#22c55e",

                    "#ef4444"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/* ======================================
   KATEGORIAT
====================================== */

function piirraKategoriatChart(){

    const canvas=document.getElementById("categoryChart");

    if(!canvas) return;

    const kategoriat={};

    tapahtumat.forEach(t=>{

        if(t.tyyppi==="Meno"){

            kategoriat[t.kategoria]=(kategoriat[t.kategoria]||0)+Number(t.summa);

        }

    });

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart=new Chart(canvas,{

        type:"bar",

        data:{

            labels:Object.keys(kategoriat),

            datasets:[{

                label:"Menot",

                data:Object.values(kategoriat)

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}
/* ======================================
   HAKU
====================================== */

function haeTapahtumat(){

    const haku = document
        .getElementById("haku")
        .value
        .toLowerCase();

    document.querySelectorAll("#tapahtumat li").forEach(rivi=>{

        if(rivi.textContent.toLowerCase().includes(haku)){

            rivi.style.display="flex";

        }else{

            rivi.style.display="none";

        }

    });

}

/* ======================================
   KUUKAUSITAVOITE
====================================== */

function tallennaTavoite(){

    const tavoite = Number(
        document.getElementById("kuukausiTavoite").value
    );

    localStorage.setItem(
        "kuukausitavoite",
        tavoite
    );

    paivitaTavoite();

    alert("Tavoite tallennettu.");

}

/* ======================================
   CSV-VIENTI
====================================== */

function vieCSV(){

    let csv =
        "Nimi;Tyyppi;Kategoria;Summa;Päivä\n";

    tapahtumat.forEach(t=>{

        csv +=
            `${t.nimi};${t.tyyppi};${t.kategoria};${t.summa};${t.paiva}\n`;

    });

    const blob = new Blob(

        [csv],

        {type:"text/csv;charset=utf-8;"}

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "finero_tapahtumat.csv";

    link.click();

}

/* ======================================
   TYHJENNÄ KAIKKI
====================================== */

function tyhjennaKaikki(){

    if(!confirm("Poistetaanko kaikki tapahtumat?")){

        return;

    }

    tapahtumat = [];

    tallenna();

    paivitaKaikki();

}

/* ======================================
   ASETUKSET
====================================== */

function lataaAsetukset(){

    const tavoite =
        localStorage.getItem("kuukausitavoite");

    const kentta =
        document.getElementById("kuukausiTavoite");

    if(kentta && tavoite){

        kentta.value = tavoite;

    }

}

/* ======================================
   KÄYNNISTYS
====================================== */

document.addEventListener("DOMContentLoaded",()=>{

    naytaSivu("etusivu");

    lataaAsetukset();

    paivitaKaikki();

});
// ==========================
// SUPABASE AUTH
// ==========================

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginBtn");
const registerButton = document.getElementById("registerBtn");

async function register() {

    const email = emailInput.value;
    const password = passwordInput.value;

    const { error } = await sb.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Käyttäjä luotu! Tarkista sähköpostisi.");
}

async function login() {

    const email = emailInput.value;
    const password = passwordInput.value;

    const { error } = await sb.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    await lataaTapahtumat();

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
}

registerButton.addEventListener("click", register);
loginButton.addEventListener("click", login);

sb.auth.getSession().then(({ data }) => {

    if (data.session) {

        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("appContent").style.display = "block";

    }

});
