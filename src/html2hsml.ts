import * as sax from "sax";

export function html2hsml(html: string): any {
    const strict = false; // set to false for html-mode
    const parser = sax.parser(strict, {});

    const root = [[]] as any;
    const nodePath = [] as any; // path that consist of previous hsml nodes
    let pointer = root;

    parser.onerror = error => {
        console.error(error);
    };

    parser.ontext = text => {
        const textTrimmed = text.trim().replace(/\s+/mg, " ");
        if (textTrimmed) {
            pointer[pointer.length - 1].push(textTrimmed);
        }
    };

    parser.onopentag = node => {
        const attrKeys = Object.keys(node.attributes);
        let id;
        let classes = [] as string[];
        const attrs = {} as {[key: string]: any};
        const attrData = {} as {[key: string]: any};
        if (attrKeys.length) {
            attrKeys.forEach(key => {
                const value = node.attributes[key] as string;
                if (key === "ID") {
                    id = value;
                } else if (key === "CLASS") {
                    const clss = value.split(" ");
                    classes = classes.concat(clss);
                } else if (/DATA-.+/.test(key)) {
                    const g = /DATA-(.+)/.exec(key);
                    attrData[g[1].toLowerCase()] = value;
                } else {
                    attrs[key.toLowerCase()] = value;
                }
            });
        }
        let name = node.name.toLowerCase();
        if (id) {
            name += "#" + id;
        }
        if (classes.length) {
            name += "." + classes.join(".");
        }
        if (Object.keys(attrData).length) {
            attrs["data"] = attrData;
        }
        const hsmlNode = [name] as any[];
        if (Object.keys(attrs).length) {
            hsmlNode.push(attrs);
        }
        const children: any[] = [];
        hsmlNode.push(children);

        pointer[pointer.length - 1].push(hsmlNode);
        nodePath.push(hsmlNode);
        pointer = hsmlNode;
    };

    parser.onclosetag = _ => {
        const currentNode = nodePath.pop();

        let children = currentNode[currentNode.length - 1];
        if (children.length === 0) {
            currentNode.pop(); // remove children
        } else if (children.length === 1) {
            if (typeof children[0] === "string") { // convert ["text"] -> "text"
                currentNode[currentNode.length - 1] = children[0];
            }
        }
        // set pointer to previous node
        pointer = nodePath[nodePath.length - 1];
    };

    parser.write(html.trim()).close();
    return root[0][0];
}
