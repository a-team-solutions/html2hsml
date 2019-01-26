import { XWidget, Action } from "prest-lib/dist/hsml-xwidget";
import { Hsmls, HsmlAttrOnData } from "prest-lib/dist/hsml";
import { html2hsml, prettify } from "./html2hsml";

interface AppState {
    html: string;
    hsml: string;
    err: string;
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
        hsml: "",
        err: ""
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
                            rows: 30,
                            styles: {
                                color: "grey",
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
            ],
            state.err && ["div", { style: { color: "darkred" } }, [
                ["blockquote", [
                    ["p", state.err]
                ]]
            ]]

        ];
    }

    onAction(action: string, data?: HsmlAttrOnData): void {
        switch (action) {

            case Actions.onChange:
                this.state.html = data as string;
                this.update();
                break;
            case Actions.onConvert:
                try {
                    const hsml = html2hsml(this.state.html);
                    const prettyHsml = prettify(hsml);

                    this.state.hsml = prettyHsml;
                    this.state.err = "";
                } catch(err) {
                    this.state.err = "Error while parsing, please make sure you have corrected HTML";
                }
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

