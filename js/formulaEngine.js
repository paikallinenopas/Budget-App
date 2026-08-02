/* ==========================================
   FINERO Formula Engine v1
========================================== */

class FormulaEngine {

    constructor() {
        this.formulas = new Map();
    }

    evaluate(formula, cells) {

        if (!formula.startsWith("=")) {
            return formula;
        }

        let expression = formula.substring(1);

        // Korvaa soluviittaukset (A1, B2...)
        expression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {

            const value = cells[match];

            if (value === undefined || value === "") {
                return 0;
            }

            const number = Number(value);

            return isNaN(number) ? 0 : number;

        });

        try {

            return Function(
                `"use strict"; return (${expression})`
            )();

        } catch {

            return "#ERROR";

        }

    }

}

const formulaEngine = new FormulaEngine();
/* ==========================================
   Solujen käsittely
========================================== */

const cellData = {};

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".workspace-cell").forEach(cell => {

        cell.addEventListener("keydown", (e) => {

            if (e.key !== "Enter") return;

            e.preventDefault();

            const cellId = cell.dataset.cell;
            const text = cell.innerText.trim();

            if (text.startsWith("=")) {

                cellData[cellId] = {
                    formula: text
                };

                const values = {};

                document.querySelectorAll(".workspace-cell").forEach(c => {

                    const id = c.dataset.cell;

                    values[id] = c.innerText.trim();

                });

                const result = formulaEngine.evaluate(text, values);

                cell.innerText = result;

            } else {

                cellData[cellId] = {
                    value: text
                };

            }

        });

    });

});