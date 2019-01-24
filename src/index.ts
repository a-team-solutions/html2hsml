import { XWidget, Action } from "prest-lib/dist/hsml-xwidget";
import { Hsmls, HsmlAttrOnData } from "prest-lib/dist/hsml";
import { html2hsml } from "./html2hsml";

interface AppState {
    html: string;
    hsml: string;
}

enum Actions {
    onChange = "onChange",
    onConvert = "onConvert"
}

class App extends XWidget<AppState> {

    constructor() {
        super("App");
    }

    state = {
        html: "",
        hsml: ""
    };

    view(state: AppState, action: Action): Hsmls {
        return [
            ["div",
                { styles: { display: "inline-block", width: "50%", padding: "10px" } },
                [
                    ["h2", "HTML (input)"],
                    ["textarea",
                        {
                            placeholder: "Place your html here :)",
                            rows: 30,
                            styles: {
                                width: "100%",
                                ["min-height"]: "350px"
                            },
                            on: ["input", Actions.onChange, e => (e.target as any).value]
                        },
                        state.html
                    ]
                ]
            ],
            ["div",
                { styles: { display: "inline-block", width: "50%", padding: "10px" } },
                [
                    ["h2", "HSML (output)"],
                    ["textarea",
                        {
                            placeholder: "HSML output will be displayed here",
                            readonly: true,
                            rows: 30,
                            styles: {
                                width: "100%",
                                ["min-height"]: "350px"
                            }
                        },
                        state.hsml
                    ]
                ]
            ],
            ["div",
                { styles: { width: "100%", textAlign: "center" }},
                [
                    ["button.button", { on: ["click", Actions.onConvert] }, "Convert to HSML"]
                ]
            ]
            // ["p", [
            //     ["em", "Count"], ": ", state.count,
            //     " ",
            //     ["button", { on: ["click", Actions.dec, 1] }, "-"],
            //     ["button", { on: ["click", Actions.inc, 2] }, "+"]
            // ]],
        ];
    }

    onMount(): void {
        console.log("mount", this.type, XWidget.mounted);
    }

    onUmount(): void {
        console.log("umount", this.type, XWidget.mounted);
    }

    onAction(action: string, data?: HsmlAttrOnData): void {
        console.log("action:", action, data);
        switch (action) {

            case Actions.onChange:
                this.state.html = data as string;
                this.update();
                break;
            case Actions.onConvert:
                const hsml = html2hsml(this.state.html);
                this.state.hsml = JSON.stringify(hsml, null, 2);
                this.update();
                break;
        }
    }
}

const el = document.getElementById("app");
if (el) {
    const app = new App().mount(el);
    (self as any).app = app;
} else {
    throw new Error("Invalid element");
}

