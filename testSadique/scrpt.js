function addNewLineNodesAfterEachParagraph(nodes) {
    console.log('nodes inside addNewLineNodesAfterEachParagraph ->', nodes);
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        console.log('node type');
        if (node.type === 'IMAGE') {
            result.push({
                "type": "PARAGRAPH",
                "id": generateId(),
                "nodes": [{
                    "type": "TEXT",
                    "id": generateId(),
                    "textData": {
                        "text": "\n"
                    }
                },]
            });
            result.push(node);
        } else if (node.type === 'PARAGRAPH' && node?.nodes[0]?.textData?.decorations[0]?.type === "BOLD") {
            result.push({
                "type": "PARAGRAPH",
                "id": generateId(),
                "nodes": [{
                    "type": "TEXT",
                    "id": generateId(),
                    "textData": {
                        "text": "\n"
                    }
                },]
            });
            result.push(node);
        } else if (node.type === 'HEADING' && node?.headingData?.level === 3) {
            result.push({
                "type": "PARAGRAPH",
                "id": generateId(),
                "nodes": [{
                    "type": "TEXT",
                    "id": generateId(),
                    "textData": {
                        "text": "\n"
                    }
                },]
            });
            result.push(node);
        } else {
            result.push(node);
        }
    }
    return result;
}