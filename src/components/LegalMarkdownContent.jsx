import React from "react";

const INLINE_TOKEN_REGEX =
  /(\[[^\]]+\]\((https?:\/\/[^)\s]+|www\.[^)\s]+|mailto:[^)\s]+)\)|https?:\/\/[^\s<]+|www\.[^\s<]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

function trimTrailingPunctuation(value) {
  const match = String(value).match(/^(.+?)([.,;:!?)]*)$/);
  return {
    text: match?.[1] || value,
    trailing: match?.[2] || "",
  };
}

function getLinkHref(value) {
  if (value.startsWith("mailto:")) return value;
  if (value.includes("@") && !value.startsWith("http")) return `mailto:${value}`;
  if (value.startsWith("www.")) return `https://${value}`;
  return value;
}

function renderAnchor(label, href, key) {
  const isEmail = href.startsWith("mailto:");

  return (
    <a
      key={key}
      href={href}
      className="font-medium text-primary underline underline-offset-2 transition hover:text-primary/80"
      {...(!isEmail
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
    >
      {label}
    </a>
  );
}

function renderLinkedText(text, keyPrefix) {
  const source = String(text);
  const nodes = [];
  let lastIndex = 0;

  source.replace(INLINE_TOKEN_REGEX, (match, markdownMatch, markdownHref, offset) => {
    if (offset > lastIndex) {
      nodes.push(source.slice(lastIndex, offset));
    }

    const markdownLink = match.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (markdownLink) {
      const label = markdownLink[1];
      const href = getLinkHref(markdownLink[2]);
      nodes.push(renderAnchor(label, href, `${keyPrefix}-link-${offset}`));
    } else {
      const { text: cleanText, trailing } = trimTrailingPunctuation(match);
      const href = getLinkHref(cleanText);
      nodes.push(renderAnchor(cleanText, href, `${keyPrefix}-link-${offset}`));
      if (trailing) nodes.push(trailing);
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes.map((node, index) =>
    typeof node === "string" ? (
      <React.Fragment key={`${keyPrefix}-text-${index}`}>{node}</React.Fragment>
    ) : (
      node
    ),
  );
}

function renderInlineText(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-gray-950">
          {renderLinkedText(part.slice(2, -2), `strong-${index}`)}
        </strong>
      );
    }

    return (
      <React.Fragment key={`${part}-${index}`}>
        {renderLinkedText(part, `inline-${index}`)}
      </React.Fragment>
    );
  });
}

function LegalMarkdownContent({
  content = "",
  className = "",
  skipFirstHeading = false,
}) {
  const lines = String(content).split(/\r?\n/);
  const elements = [];
  let listItems = [];
  let paragraphLines = [];
  let skippedFirstHeading = false;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;

    const text = paragraphLines.join(" ").trim();
    if (text) {
      elements.push(
        <p key={`p-${elements.length}`} className="text-sm leading-7 text-gray-600">
          {renderInlineText(text)}
        </p>,
      );
    }
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;

    elements.push(
      <ul
        key={`ul-${elements.length}`}
        className="space-y-2 pl-5 text-sm leading-6 text-gray-600"
      >
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`} className="list-disc">
            {renderInlineText(item)}
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="pt-3 text-lg font-semibold text-gray-950"
        >
          {line.slice(3)}
        </h2>,
      );
      return;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();

      if (skipFirstHeading && !skippedFirstHeading) {
        skippedFirstHeading = true;
        return;
      }

      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl font-bold text-gray-950"
        >
          {line.slice(2)}
        </h1>,
      );
      return;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2));
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return <div className={`space-y-4 ${className}`}>{elements}</div>;
}

export { LegalMarkdownContent };
