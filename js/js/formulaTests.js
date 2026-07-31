/* ==========================================
   FINERO Formula Engine Tests
========================================== */

function runFormulaTests() {

    const tests = [

        { formula: "=100+200", expected: 300 },

        { formula: "=20*5", expected: 100 },

        { formula: "=1000/4", expected: 250 },

        { formula: "=(10+20)*3", expected: 90 }

    ];

    let passed = 0;

    tests.forEach(test => {

        const result = formulaEngine.evaluate(
            test.formula,
            {}
        );

        if (result === test.expected) {

            console.log("✅", test.formula);

            passed++;

        } else {

            console.error(
                "❌",
                test.formula,
                "=>",
                result,
                "(odotettiin",
                test.expected + ")"
            );

        }

    });

    console.log(
        `Formula Engine: ${passed}/${tests.length} testiä onnistui`
    );

}