const chalk = require('chalk');

const scopeColors = {
    SYSTEM: chalk.cyan,
    DATABASE: chalk.magenta,
    STATISTICS: chalk.blue,
    VOICE: chalk.yellow,
    COMMANDS: chalk.green,
    EVENTS: chalk.green,
    CLEANUP: chalk.green,
    UPDATE: chalk.yellow,
};

const symbols = {
    info: chalk.blue('◆'),
    success: chalk.green('✓'),
    warn: chalk.yellow('!'),
    error: chalk.red('✖'),
};

function displayValue(value) {
    if (value instanceof Error) return value.stack || value.message;
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value);
}

function printTree(value, indent, branch = '└─', hiddenKey = null) {
    if (Array.isArray(value)) {
        value.slice(0, 50).forEach((item, index, items) => {
            const itemBranch = index === items.length - 1 ? '└─' : '├─';
            if (item && typeof item === 'object' && !Array.isArray(item)) {
                const label = item.name || item.id || `Élément ${index + 1}`;
                console.log(`${indent}${itemBranch} ${label}`);
                printTree(item, `${indent}${index === items.length - 1 ? '  ' : '│ '}`, '└─', item.name ? 'name' : 'id');
            } else {
                console.log(`${indent}${itemBranch} ${displayValue(item)}`);
            }
        });
        if (value.length > 50) console.log(`${indent}└─ ... ${value.length - 50} élément(s) supplémentaire(s)`);
        return;
    }

    if (value && typeof value === 'object') {
        const entries = Object.entries(value).filter(([key]) => key !== hiddenKey);
        entries.forEach(([key, child], index) => {
            const childBranch = index === entries.length - 1 ? '└─' : '├─';
            if (child && typeof child === 'object') {
                console.log(`${indent}${childBranch} ${key}`);
                printTree(child, `${indent}${index === entries.length - 1 ? '  ' : '│ '}`);
            } else {
                console.log(`${indent}${childBranch} ${key}: ${displayValue(child)}`);
            }
        });
        return;
    }

    console.log(`${indent}${branch} ${displayValue(value)}`);
}

function write(level, scope, message, ...details) {
    const colorScope = scopeColors[scope] || chalk.white;
    const symbol = symbols[level] || symbols.info;
    const scopeLabel = colorScope(`[${scope}]`.padEnd(12));
    console.log(`${symbol} ${scopeLabel} ${message}`);

    for (const detail of details) {
        if (!detail || typeof detail !== 'object') {
            console.log(`  └─ ${detail}`);
            continue;
        }
        printTree(detail, '  ');
    }
}

module.exports = {
    info: (scope, message, ...details) => write('info', scope, message, ...details),
    success: (scope, message, ...details) => write('success', scope, message, ...details),
    warn: (scope, message, ...details) => write('warn', scope, message, ...details),
    error: (scope, message, ...details) => write('error', scope, message, ...details),
};
