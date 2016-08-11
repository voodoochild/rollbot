import m from "mithril";
import compact from "lodash.compact";

function d10() {
    return Math.floor(Math.random() * 10) + 1;
}

m.mount(document.body, {
    controller() {
        let ctrl = {
            dicepool : m.prop(1),
            reroll : {
                "10" : m.prop(true),
                "9" : m.prop(false),
                "8" : m.prop(false)
            },
            results : [],

            roll() {
                let dice = ctrl.dicepool(),
                    roll;

                ctrl.results = [];

                while(dice) {
                    roll = d10();

                    if(ctrl.reroll["10"]() && roll === 10) {
                        dice++;
                    }

                    if(ctrl.reroll["9"]() && roll === 9) {
                        dice++;
                    }

                    if(ctrl.reroll["8"]() && roll === 8) {
                        dice++;
                    }

                    ctrl.results.push(roll);
                    dice--;
                }
            },

            rollSomeDice(dice) {
                let rolls = [];

                for(let i = 0; i < dice; i++) {
                    rolls.push(d10());
                }

                return rolls;
            },

            reset() {
                ctrl.dicepool(1);
                ctrl.results = [];
                ctrl.reroll["8"](false);
                ctrl.reroll["9"](false);
            }
        };

        return ctrl;
    },

    view(ctrl) {
        let successes = ctrl.results.length ? ctrl.results.filter(n => n > 7).length : null;

        return m("main",
            m("input", {
                class : "dicepool",
                type : "number",
                min : 1,
                max : 100,
                onchange : m.withAttr("value", ctrl.dicepool),
                value : ctrl.dicepool()
            }),
            m("button", {
                class : "button roll",
                onclick : ctrl.roll.bind(ctrl)
            }, "Roll"),
            m(".controls",
                m("button", {
                    onclick : ctrl.reset.bind(ctrl)
                }, "Reset"),
                Object.keys(ctrl.reroll).map(key => {
                    let id = `reroll-${key}`,
                        checked = ctrl.reroll[key]();

                    return [
                        m("input", {
                            id,
                            type : "checkbox",
                            checked : checked ? "checked" : null,
                            onchange : m.withAttr("checked", ctrl.reroll[key])
                        }),
                        m("label", {
                            class : compact(["button", checked ? "button-active" : null]).join(" "),
                            for : id
                        }, `↻ ${key}`)
                    ];
                })
            ),
            m(".results",
                "[ ",
                ctrl.results.length ? ctrl.results.join(", ") : null,
                successes === 1 ? " = 1 success!" : successes > 1 ? ` = ${successes} successes!` : null,
                " ]")
        );
    }
});
