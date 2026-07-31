/* =================================
   FINERO 4.0
   DASHBOARD
================================= */


function paivitaDashboard(){

    paivitaSaldo();
    paivitaSaastoaste();
    paivitaWidgetit();

}


/* ================================
   SÄÄSTÖASTE
================================ */

function paivitaSaastoaste(){

    let tulot = 0;
    let menot = 0;


    tapahtumat.forEach(t => {

        if(t.tyyppi === "Tulo"){
            tulot += Number(t.summa);
        }

        if(t.tyyppi === "Meno"){
            menot += Number(t.summa);
        }

    });


    const saasto = tulot - menot;


    let prosentti = 0;

    if(tulot > 0){
        prosentti = (saasto / tulot) * 100;
    }


    const elementti =
        document.getElementById("saastoAste");


    if(elementti){

        elementti.textContent =
        prosentti.toFixed(0) + "%";

    }

}


/* ================================
   MUOKATTAVAT WIDGETIT
================================ */

function paivitaWidgetit(){

    const widgetit =
    document.querySelectorAll(".dashboard-widget");


    widgetit.forEach(widget => {

        widget.style.animation =
        "fadeIn .4s ease";

    });

}