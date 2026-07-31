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

    function suoritaKaava(kaava){

    try {

        let lasku = kaava;


        document.querySelectorAll("td")
        .forEach((solu)=>{

            let nimi = solu.dataset.cell;

            let arvo = Number(solu.innerText);


            if(nimi && !isNaN(arvo)){

                lasku = lasku.replaceAll(
                    nimi,
                    arvo
                );

            }

        });


        return Function(
            "return " + lasku
        )();


    } catch(e){

        console.log(e);
        return "Virhe";

    }


/* Käynnistä kun sivu latautuu */

document.addEventListener(
"DOMContentLoaded",
kaynnistaWorkspace
);