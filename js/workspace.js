/* =================================
   FINERO WORKSPACE
   Excel-laskentamoottori
================================= */


let workspaceData = {};


/* Käynnistys */

function kaynnistaWorkspace(){

    const solut =
    document.querySelectorAll(".workspace-cell");


    solut.forEach(solutieto => {

        solutieto.addEventListener(
            "input",
            laskeKaavat
        );

    });

}



/* Kaavojen laskenta */

function laskeKaavat(){

    const solut =
    document.querySelectorAll(".workspace-cell");


    solut.forEach((solu,index)=>{

        let nimi =
        solu.dataset.cell;


        workspaceData[nimi] =
        solu.innerText;

    });


    solut.forEach(solu=>{

        let arvo =
        solu.innerText;


        if(arvo.startsWith("=")){

            solu.innerText =
            suoritaKaava(
                arvo.substring(1)
            ).toString();
        }

    });

}



/* Kaavojen käsittely */

function suoritaKaava(kaava){

    try{

        let lasku = kaava;

        document
            .querySelectorAll(".workspace-cell")
            .forEach((solu)=>{

                let nimi = solu.dataset.cell;
                let arvo = Number(solu.innerText);

                if(nimi && !isNaN(arvo)){
                    lasku = lasku.replaceAll(nimi, arvo);
                }

            });

        return Function("return " + lasku)();

    }catch(e){

        console.error(e);
        return "Virhe";

    }

}


/* Käynnistä kun sivu latautuu */

document.addEventListener(
"DOMContentLoaded",
kaynnistaWorkspace
);
let aktiivinenSolu = null;

document.querySelectorAll(".workspace-cell").forEach((solu)=>{

    solu.addEventListener("click",()=>{

        aktiivinenSolu = solu;

        document.getElementById("activeCell").textContent =
            solu.dataset.cell;

        document.getElementById("formulaInput").value =
            solu.innerText;

    });

});

document.getElementById("formulaInput").addEventListener("input",function(){

    if(!aktiivinenSolu) return;

    aktiivinenSolu.innerText = this.value;

    laskeKaavat();

});
/* ==========================
   SOLUJEN VALINTA
========================== */

let aktiivinenSolu = null;

const kaikkiSolut = document.querySelectorAll(".workspace-cell");

kaikkiSolut.forEach((solu) => {

    solu.addEventListener("click", () => {

        if (aktiivinenSolu) {
            aktiivinenSolu.classList.remove("selected-cell");
        }

        aktiivinenSolu = solu;

        aktiivinenSolu.classList.add("selected-cell");

        document.getElementById("activeCell").textContent =
            solu.dataset.cell;

        document.getElementById("formulaInput").value =
            solu.innerText;

    });

});
/* ==========================
   NUOLINÄPPÄIMET
========================== */

document.addEventListener("keydown", (e)=>{

    if(!aktiivinenSolu) return;

    const nimi = aktiivinenSolu.dataset.cell;

    const sarake = nimi.charCodeAt(0);
    const rivi = parseInt(nimi.substring(1));

    let uusi = null;

    if(e.key==="ArrowRight")
        uusi = String.fromCharCode(sarake+1)+rivi;

    if(e.key==="ArrowLeft")
        uusi = String.fromCharCode(sarake-1)+rivi;

    if(e.key==="ArrowDown")
        uusi = String.fromCharCode(sarake)+(rivi+1);

    if(e.key==="ArrowUp")
        uusi = String.fromCharCode(sarake)+(rivi-1);

    if(uusi){

        e.preventDefault();

        const solu = document.querySelector(
            `[data-cell="${uusi}"]`
        );

        if(solu){
            solu.click();
        }

    }

});