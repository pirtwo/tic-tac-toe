export default function minmax(node, depth, type = 'max') {
    let value;

    if (depth == 0 || node.isTerminal()) {
        return node.getValue();
    }

    if (type == 'max') {
        value = -Infinity;
        node.getSuccessors().forEach(child => {
            value = Math.max(value, minmax(child, depth - 1, 'min'));
        });
    }

    if (type == 'min') {
        value = Infinity;
        node.getSuccessors().forEach(child => {
            value = Math.min(value, minmax(child, depth - 1, 'max'));
        });
    }

    return value;
}