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