import React from "react";

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Split on **bold** segments, keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(part);
    if (m) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold">
          {m[1]}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

type Block =
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

function parse(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line);

    if (bullet) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ul") last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
    } else if (numbered) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ol") last.items.push(numbered[1]);
      else blocks.push({ type: "ol", items: [numbered[1]] });
    } else if (line.trim() === "") {
      // paragraph break — ignore, blocks already separated
    } else {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "p") last.text += "\n" + line;
      else blocks.push({ type: "p", text: line });
    }
  }

  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <>
      {blocks.map((block, bi) => {
        if (block.type === "ul") {
          return (
            <ul key={bi} className="my-1 list-disc space-y-0.5 pl-4">
              {block.items.map((item, ii) => (
                <li key={ii}>{renderInline(item, `${bi}-${ii}`)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={bi} className="my-1 list-decimal space-y-0.5 pl-4">
              {block.items.map((item, ii) => (
                <li key={ii}>{renderInline(item, `${bi}-${ii}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi} className="whitespace-pre-wrap [&:not(:first-child)]:mt-2">
            {renderInline(block.text, `${bi}`)}
          </p>
        );
      })}
    </>
  );
}
