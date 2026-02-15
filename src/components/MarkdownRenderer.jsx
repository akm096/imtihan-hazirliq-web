import "./MarkdownRenderer.css";

/**
 * Simple markdown + math renderer for AI chat messages.
 * Handles: headers, bold, italic, code blocks, inline code,
 * lists, math ($...$), and line breaks.
 */
export default function MarkdownRenderer({ text }) {
    if (!text) return null;

    const blocks = parseBlocks(text);

    return (
        <div className="md-render">
            {blocks.map((block, i) => renderBlock(block, i))}
        </div>
    );
}

function parseBlocks(text) {
    const lines = text.split("\n");
    const blocks = [];
    let codeBlock = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block start/end
        if (line.trim().startsWith("```")) {
            if (codeBlock) {
                blocks.push({ type: "code", lang: codeBlock.lang, content: codeBlock.lines.join("\n") });
                codeBlock = null;
            } else {
                codeBlock = { lang: line.trim().replace("```", "").trim(), lines: [] };
            }
            continue;
        }

        if (codeBlock) {
            codeBlock.lines.push(line);
            continue;
        }

        // Headers
        if (line.startsWith("### ")) {
            blocks.push({ type: "h3", content: line.slice(4) });
        } else if (line.startsWith("## ")) {
            blocks.push({ type: "h2", content: line.slice(3) });
        } else if (line.startsWith("# ")) {
            blocks.push({ type: "h1", content: line.slice(2) });
        }
        // Horizontal rule
        else if (line.trim() === "---" || line.trim() === "***") {
            blocks.push({ type: "hr" });
        }
        // Unordered list
        else if (/^\s*[-*]\s+/.test(line)) {
            const content = line.replace(/^\s*[-*]\s+/, "");
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock && lastBlock.type === "ul") {
                lastBlock.items.push(content);
            } else {
                blocks.push({ type: "ul", items: [content] });
            }
        }
        // Ordered list
        else if (/^\s*\d+[.)]\s+/.test(line)) {
            const content = line.replace(/^\s*\d+[.)]\s+/, "");
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock && lastBlock.type === "ol") {
                lastBlock.items.push(content);
            } else {
                blocks.push({ type: "ol", items: [content] });
            }
        }
        // Empty line
        else if (line.trim() === "") {
            blocks.push({ type: "br" });
        }
        // Normal paragraph
        else {
            blocks.push({ type: "p", content: line });
        }
    }

    // Close unclosed code block
    if (codeBlock) {
        blocks.push({ type: "code", lang: codeBlock.lang, content: codeBlock.lines.join("\n") });
    }

    return blocks;
}

function renderBlock(block, key) {
    switch (block.type) {
        case "h1":
            return <h3 key={key} className="md-h1">{renderInline(block.content)}</h3>;
        case "h2":
            return <h4 key={key} className="md-h2">{renderInline(block.content)}</h4>;
        case "h3":
            return <h5 key={key} className="md-h3">{renderInline(block.content)}</h5>;
        case "hr":
            return <hr key={key} className="md-hr" />;
        case "code":
            return (
                <pre key={key} className="md-code-block">
                    <code>{block.content}</code>
                </pre>
            );
        case "ul":
            return (
                <ul key={key} className="md-ul">
                    {block.items.map((item, i) => (
                        <li key={i}>{renderInline(item)}</li>
                    ))}
                </ul>
            );
        case "ol":
            return (
                <ol key={key} className="md-ol">
                    {block.items.map((item, i) => (
                        <li key={i}>{renderInline(item)}</li>
                    ))}
                </ol>
            );
        case "br":
            return <div key={key} className="md-spacer" />;
        case "p":
        default:
            return <p key={key} className="md-p">{renderInline(block.content)}</p>;
    }
}

/**
 * Render inline elements: bold, italic, inline code, math
 */
function renderInline(text) {
    if (!text) return null;

    // Split by patterns: **bold**, *italic*, `code`, $math$
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Find the earliest match
        const patterns = [
            { regex: /\*\*(.+?)\*\*/, type: "bold" },
            { regex: /\*(.+?)\*/, type: "italic" },
            { regex: /`(.+?)`/, type: "code" },
            { regex: /\$\$(.+?)\$\$/, type: "math-block" },
            { regex: /\$(.+?)\$/, type: "math" },
        ];

        let earliest = null;
        let earliestIndex = Infinity;

        for (const pattern of patterns) {
            const match = remaining.match(pattern.regex);
            if (match && match.index < earliestIndex) {
                earliest = { match, type: pattern.type };
                earliestIndex = match.index;
            }
        }

        if (earliest) {
            // Add text before match
            if (earliestIndex > 0) {
                parts.push(<span key={key++}>{remaining.substring(0, earliestIndex)}</span>);
            }

            const content = earliest.match[1];

            switch (earliest.type) {
                case "bold":
                    parts.push(<strong key={key++}>{content}</strong>);
                    break;
                case "italic":
                    parts.push(<em key={key++}>{content}</em>);
                    break;
                case "code":
                    parts.push(<code key={key++} className="md-inline-code">{content}</code>);
                    break;
                case "math-block":
                    parts.push(
                        <div key={key++} className="md-math-block">{formatMath(content)}</div>
                    );
                    break;
                case "math":
                    parts.push(
                        <span key={key++} className="md-math">{formatMath(content)}</span>
                    );
                    break;
            }

            remaining = remaining.substring(earliestIndex + earliest.match[0].length);
        } else {
            parts.push(<span key={key++}>{remaining}</span>);
            remaining = "";
        }
    }

    return parts;
}

/**
 * Format LaTeX-like math into readable text.
 * Converts common LaTeX commands to Unicode equivalents.
 */
function formatMath(text) {
    return text
        // Fractions: \frac{a}{b} → a/b
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
        // Superscript: ^{...} → superscript or just ^...
        .replace(/\^{([^}]+)}/g, "^$1")
        .replace(/\^\{([^}]+)\}/g, "^$1")
        // Subscript: _{...}
        .replace(/_{([^}]+)}/g, "₍$1₎")
        .replace(/_\{([^}]+)\}/g, "₍$1₎")
        // Common commands
        .replace(/\\cdot/g, "·")
        .replace(/\\times/g, "×")
        .replace(/\\div/g, "÷")
        .replace(/\\pm/g, "±")
        .replace(/\\neq/g, "≠")
        .replace(/\\leq/g, "≤")
        .replace(/\\geq/g, "≥")
        .replace(/\\approx/g, "≈")
        .replace(/\\infty/g, "∞")
        .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
        .replace(/\\sqrt/g, "√")
        // Greek letters
        .replace(/\\alpha/g, "α")
        .replace(/\\beta/g, "β")
        .replace(/\\gamma/g, "γ")
        .replace(/\\delta/g, "δ")
        .replace(/\\Delta/g, "Δ")
        .replace(/\\theta/g, "θ")
        .replace(/\\lambda/g, "λ")
        .replace(/\\mu/g, "μ")
        .replace(/\\pi/g, "π")
        .replace(/\\sigma/g, "σ")
        .replace(/\\omega/g, "ω")
        .replace(/\\Omega/g, "Ω")
        .replace(/\\rho/g, "ρ")
        .replace(/\\tau/g, "τ")
        .replace(/\\phi/g, "φ")
        // Arrows
        .replace(/\\rightarrow/g, "→")
        .replace(/\\leftarrow/g, "←")
        .replace(/\\Rightarrow/g, "⇒")
        // Cleanup backslashes
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\mathrm\{([^}]+)\}/g, "$1")
        .replace(/\\ /g, " ")
        .replace(/\\,/g, " ")
        .replace(/\{/g, "")
        .replace(/\}/g, "");
}
