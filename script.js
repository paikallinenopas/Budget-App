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
    
console.log("nimi:", nimi);
console.log("summa:", summa);
console.log("paiva:", paiva);
if (nimi === "" || !summa || !paiva) {
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
    document.getElementById("paivamaara").value="";

}

/* ======================================
   TAPAHTUMALISTA
====================================== */

function piirraTapahtumat(){

    function piirraTapahtumat(){

    const container =
    document.getElementById("recentTransactions");

    if(!container) return;

    container.innerHTML="";

    const viimeiset =
    tapahtumat.slice(0,6);

    if(viimeiset.length===0){

        container.innerHTML=`

        <div class="empty-text">

            Ei tapahtumia vielä.

        </div>

        `;

        return;

    }

    viimeiset.forEach(t=>{

        container.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-left">

                <div class="transaction-icon">

                    ${haeTapahtumaIkoni(t.kategoria)}

                </div>

                <div>

                    <div class="transaction-title">

                        ${t.nimi}

                    </div>

                    <div class="transaction-sub">

                        ${t.kategoria}

                        •

                        ${t.paiva}

                    </div>

                </div>

            </div>

            <div class="transaction-price
            ${t.tyyppi==="Tulo"
            ?"income":"expense"}">

                ${t.tyyppi==="Tulo"
                ?"+":"-"}

                ${euro(t.summa)}

            </div>

        </div>

        `;

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
const saasto = tulot - menot;

const saastoEl =
document.getElementById("saasto");

if(saastoEl){

    saastoEl.textContent =
    euro(saasto);

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

    paivitaGoalCounter();

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

    const canvas =
    document.getElementById("saldoMiniChart");

    if(!canvas) return;

    let saldo = 0;

    const historia = [];

    tapahtumat
        .slice()
        .reverse()
        .forEach(t=>{

            if(t.tyyppi==="Tulo"){

                saldo += Number(t.summa);

            }else{

                saldo -= Number(t.summa);

            }

            historia.push(saldo);

        });

    if(historia.length===0){

        historia.push(0);

    }

    if(saldoMiniChart){

        saldoMiniChart.destroy();

    }

    saldoMiniChart = new Chart(canvas,{

        type:"line",

        data:{

            labels:historia.map((_,i)=>i),

            datasets:[{

                data:historia,

                borderColor:"#22c55e",

                borderWidth:4,

                pointRadius:0,

                tension:.45,

                fill:false

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
/* ===================================
   GOAL MODAL
=================================== */

function avaaUusiTavoite(){

    document
        .getElementById("goalModal")
        .classList
        .remove("hidden");

}

function suljeUusiTavoite(){

    document
        .getElementById("goalModal")
        .classList
        .add("hidden");

}
/* ===================================
   SÄÄSTÖTAVOITTEET
=================================== */

let goals = [];

function luoTavoite() {

    const goal = {

        id: Date.now(),

        name: document.getElementById("goalName").value,

        target: Number(document.getElementById("goalTarget").value),

        saved: Number(document.getElementById("goalSaved").value),

        deadline: document.getElementById("goalDeadline").value,

        icon: document.getElementById("goalIcon").value,

        pinned: document.getElementById("goalPinned").checked,

        color: document.getElementById("goalColor").value,

        category: document.getElementById("goalCategory").value,

        image: document.getElementById("goalImage").value,

    };

    goals.push(goal);

    piirraTavoitteet();

    tallennaTavoitteet();

    suljeUusiTavoite();

    tyhjennaTavoiteLomake();

}
function tyhjennaTavoiteLomake(){

    goalName.value="";

    goalTarget.value="";

    goalSaved.value="0";

    goalDeadline.value="";

    goalPinned.checked=false;

}
function piirraTavoitteet(){

    const container =
    document.getElementById("goalsContainer");

    container.innerHTML="";

    goals.forEach(goal=>{

        const prosentti =
        Math.min(
            100,
            (goal.saved/goal.target)*100
        );

        container.innerHTML += `

        <div class="card goal-card">

            <div class="goal-top">

                <h2>
                    ${goal.icon}
                    ${goal.name}
                </h2>

                <button
                    class="star-btn"
                    onclick="vaihdaSuosikki(${goal.id})">

                    ${goal.pinned ? "⭐" : "☆"}

                </button>

            </div>

            <h3>

                ${goal.saved.toLocaleString("fi-FI")} €

                /

                ${goal.target.toLocaleString("fi-FI")} €

            </h3>

            <div class="progress">

                <div
                    class="progress-fill"
                    style="width:${prosentti}%">

                </div>

            </div>

            <p>

                ${prosentti.toFixed(1)} %

            </p>

            <small>

                Deadline:

                ${goal.deadline || "-"}

            </small>

            <div class="goal-buttons">

    <button
        class="secondary-btn"
        onclick="lisaaSaastoa(${goal.id})">

        💰 Lisää

    </button>

    <button
        class="secondary-btn"
        onclick="muokkaaTavoitetta(${goal.id})">

        ✏️ Muokkaa

    </button>

    <button
        class="secondary-btn danger-btn"
        onclick="poistaTavoite(${goal.id})">

        🗑️

    </button>

</div>

        </div>

        `;

    });

}

/* ===================================
   TALLENNUS
=================================== */

function tallennaTavoitteet(){

    localStorage.setItem(
        "fineroGoals",
        JSON.stringify(goals)
    );

}

function lataaTavoitteet(){

    const data =
    localStorage.getItem("fineroGoals");

    if(data){

        goals = JSON.parse(data);

        piirraTavoitteet();

    }

}

document.addEventListener(
    "DOMContentLoaded",
    lataaTavoitteet
);
function vaihdaSuosikki(id){

    const goal =
    goals.find(g=>g.id===id);

    goal.pinned =
    !goal.pinned;

    tallennaTavoitteet();

    piirraTavoitteet();

}
function poistaTavoite(id){

    if(!confirm("Poistetaanko tavoite?"))
        return;

    goals =
    goals.filter(
        g=>g.id!==id
    );

    tallennaTavoitteet();

    piirraTavoitteet();

    piirraDashboardTavoitteet();

    vaihdaSuosikki()

    poistaTavoite()

    piirraDashboardTavoitteet();

}

}
function lisaaSaastoa(id){

    const goal = goals.find(g=>g.id===id);

    if(!goal) return;

    const summa = Number(
        prompt("Kuinka paljon lisätään (€)?")
    );

    if(isNaN(summa) || summa<=0){
        return;
    }

    goal.saved += summa;

    if(goal.saved > goal.target){
        goal.saved = goal.target;
    }

    tallennaTavoitteet();

    piirraTavoitteet();

    piirraDashboardTavoitteet();
    
function piirraDashboardTavoitteet(){

    const container =
    document.getElementById("dashboardGoals");

    if(!container) return;

    container.innerHTML="";

    const pinned =
    goals.filter(g=>g.pinned);

    if(pinned.length===0){

        container.innerHTML=

        `<p class="empty-text">

            Ei kiinnitettyjä tavoitteita.

        </p>`;

        return;

    }

    pinned.forEach(goal=>{

        const prosentti =

        Math.min(

            100,

            goal.saved/goal.target*100

        );

        container.innerHTML += `

        <div class="dashboard-goal-card">

            <div class="dashboard-goal-header">

                <div>

                    <strong>

                        ${goal.icon}

                        ${goal.name}

                    </strong>

                    <div class="dashboard-goal-money">

                        ${goal.saved.toLocaleString("fi-FI")} €

                        /

                        ${goal.target.toLocaleString("fi-FI")} €

                    </div>

                </div>

                <strong>

                    ${prosentti.toFixed(0)}%

                </strong>

            </div>

            <div class="progress">

                <div

                    class="progress-fill"

                    style="width:${prosentti}%">

                </div>

            </div>

        </div>

        `;

    });

}

function muokkaaTavoitetta(id){

    const goal =
    goals.find(g=>g.id===id);

    if(!goal) return;

    const nimi =
    prompt(
        "Tavoitteen nimi",
        goal.name
    );

    if(nimi===null) return;

    goal.name = nimi;

    const tavoite =
    Number(
        prompt(
            "Tavoitesumma",
            goal.target
        )
    );

    if(!isNaN(tavoite)){

        goal.target=tavoite;

    }

    tallennaTavoitteet();

    piirraTavoitteet();

    piirraDashboardTavoitteet();

}
function laskeKuukausiSaasto(goal){

    if(!goal.deadline){

        return 0;

    }

    const nyt = new Date();

    const deadline =
    new Date(goal.deadline);

    const kuukaudet =

    Math.max(

        1,

        (deadline.getFullYear()-nyt.getFullYear())*12+

        deadline.getMonth()-nyt.getMonth()

    );

    return Math.ceil(

        (goal.target-goal.saved)

        /kuukaudet

    );

}
let editingGoalId = null;

function muokkaaTavoitetta(id){

    const goal =
    goals.find(g=>g.id===id);

    if(!goal) return;

    editingGoalId = id;

    editGoalName.value = goal.name;

    editGoalTarget.value = goal.target;

    editGoalSaved.value = goal.saved;

    editGoalDeadline.value = goal.deadline;

    editGoalModal.classList.remove("hidden");

}
function suljeMuokkaus(){

    editGoalModal.classList.add("hidden");

}
function tallennaMuokkaus(){

    const goal =
    goals.find(g=>g.id===editingGoalId);

    if(!goal) return;

    goal.name = editGoalName.value;

    goal.target =
    Number(editGoalTarget.value);

    goal.saved =
    Number(editGoalSaved.value);

    goal.deadline =
    editGoalDeadline.value;

    tallennaTavoitteet();

    piirraTavoitteet();

    piirraDashboardTavoitteet();

    suljeMuokkaus();

}
/* =====================================
   PÄIVÄMÄÄRÄ TOPBARIIN
===================================== */

function paivitaPaivamaara(){

    const el =
    document.getElementById("todayDate");

    if(!el) return;

    const nyt = new Date();

    el.textContent =
    nyt.toLocaleDateString("fi-FI",{

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}

document.addEventListener(
    "DOMContentLoaded",
    paivitaPaivamaara
);
/* =====================================
   KPI GOALS
===================================== */

function paivitaGoalCounter(){

    const valmis =
    goals.filter(g=>

        g.saved>=g.target

    ).length;

    const count =
    document.getElementById("goalCount");

    const progress =
    document.getElementById("goalProgress");

    if(count){

        count.textContent =
        valmis + " / " + goals.length;

    }

    if(progress){

        if(goals.length===0){

            progress.textContent =
            "Ei tavoitteita";

        }else{

            progress.textContent =
            Math.round(

                valmis/goals.length*100

            ) + "% valmiina";

        }

    }

}
function haeTapahtumaIkoni(kategoria){

    switch(kategoria){

        case "Ruoka":
            return "🍔";

        case "Auto":
            return "🚗";

        case "Asuminen":
            return "🏠";

        case "Palkka":
            return "💼";

        case "Sijoitukset":
            return "📈";

        case "Liikenne":
            return "🚌";

        case "Vapaa-aika":
            return "🎮";

        default:
            return "💳";

    }

}