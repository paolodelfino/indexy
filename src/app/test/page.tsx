"use client";
import { notFound } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const text = `fesaok $1 $3  gagae, 
    $2 $7 _d
    $4    fafaefe
    jiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
    $10$`;

const ups = [
  { n: 1, content: "hello" },
  { n: 2, content: "g" },
  { n: 7, content: "ef" },
  { n: 10, content: "byte" },
];

export default function Page() {
  // return notFound();
  const [text, setText] = useState(`fesaok $1 $3  gagae, 
    $2 $7 _d
    $4    fafaefe
    jiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
    $10$`);
  const [nodes, setNodes] = useState<ReactNode[]>([]);

  useEffect(() => {
    let key = 0;
    let b: ReactNode[] = [];
    for (let i = 0; i < text.length; ++i) {
      if (text[i] === "$") {
        if (text[i + 1] === "$") {
          b.push(<span key={key++}>$</span>); // Treat double "$" as a literal
          i++; // Skip the second "$"
        } else {
          let j = i + 1;
          while (j < text.length && text[j] >= "0" && text[j] <= "9") j++;
          const n = parseInt(text.slice(i + 1, j));
          if (!Number.isNaN(n)) {
            const up = ups.find((u) => u.n === n);
            if (up)
              b.push(
                <span key={key++} className="bg-neutral-700">
                  {up.content}
                </span>,
              );
            else b.push(<span key={key++}>{text.slice(i, j)}</span>);
          } else {
            b.push(<span key={key++}>$</span>); // Invalid $ usage
          }
          i = j - 1;
        }
      } else {
        let j = i;
        while (j < text.length && text[j] !== "$") j++;
        b.push(<span key={key++}>{text.slice(i, j)}</span>);
        i = j - 1;
      }
    }
    setNodes(b);

    setTimeout(() => {
      if (text !== "gskg sokgsogkseogsk ok $2 $$2 gsgs")
        setText("gskg sokgsogkseogsk ok $2 $$2 gsgs$d");
    }, 3000);
  }, [text]);

  return <div className="whitespace-pre-wrap">{nodes}</div>;
}
