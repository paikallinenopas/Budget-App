/* =================================
   FINERO WORKSPACE
   Laskutoiminnot
================================= */


function laskeWorkspaceSumma(){

    const solut =
    document.querySelectorAll(
        ".workspace-table td"
    );


    let summa = 0;


    solut.forEach(solu => {

        const arvo =
        Number(
            solu.innerText
            .replace(",", ".")
        );


        if(!isNaN(arvo)){
            summa += arvo;
        }

    });


    const tulos =
    document.getElementById(
        "workspaceTotal"
    );


    if(tulos){

        tulos.textContent =
        summa.toLocaleString("fi-FI") + " €";

    }

}
document.addEventListener("input", function(e){

    if(e.target.closest(".workspace-table")){

        laskeWorkspaceSumma();

    }

});