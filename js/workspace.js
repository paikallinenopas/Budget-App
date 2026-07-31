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

    try {

        let lasku = kaava;


        Object.keys(workspaceData)
        .forEach(cell => {

            let numero = Number(
                workspaceData[cell]
            );


            if(!isNaN(numero)){

                lasku = lasku.replaceAll(
                    cell,
                    numero
                );

            }

        });


        return Function(
            "return " + lasku
        )();


    } catch(e){

        return "Virhe";

    }

}


/* Käynnistä kun sivu latautuu */

document.addEventListener(
"DOMContentLoaded",
kaynnistaWorkspace
);