"use client";

import UIBigPaint from "@/components/db_ui/UIBigPaint";
import UIInspiration from "@/components/db_ui/UIInspiration";
import { Popover, PopoverContent } from "@/components/popover";
import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import useFormFetch__GraphData from "@/stores/forms/useFormFetch__GraphData";
import useQueryGraph__Fetch from "@/stores/queries/useQueryGraph__Fetch";
import { Node } from "@/utils/graph_client";
import { formValuesFromString } from "@/utils/url";
import { select } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

export default function Page({ params }: { params: { values: string } }) {
  const values = useMemo(
    () => schemaGraph__Fetch.parse(formValuesFromString(params.values)),
    [params],
  );

  const query = useQueryGraph__Fetch();
  const form = useFormFetch__GraphData();
  const ref = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    query.active();
    return () => query.inactive();
  }, []);

  useEffect(() => {
    // TODO: Usa shallow anche da altre parti se possibile
    if (!shallow(form.meta.lastValues, values)) {
      form.setFormMeta({ lastValues: values });

      query.fetch(values);
    }
  }, [values]);

  useEffect(() => {
    if (query.data !== undefined) {
      // TODO: Non c'è lo zoom e il drag (d3 dovrebbe dare un'implementazione per entrambi)

      const rect = ref.current!.getBoundingClientRect();

      const svg = select(ref.current)
        .append("svg")
        .attr("width", rect.width)
        .attr("height", rect.height)
        .attr("viewBox", [
          -rect.width / 2,
          -rect.height / 2,
          rect.width,
          rect.height,
        ])
        .attr("style", "max-width: 100%; height: auto;");

      const link = svg
        .append("g")
        .selectAll("line")
        .data(query.data!.links)
        .join("line")
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!)
        .attr("stroke", "#999")
        .attr("stroke-width", 2);

      const node = svg
        .append("g")
        .selectAll("circle")
        .data(query.data!.nodes)
        .join("circle")
        .attr("r", 20)
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!)
        .attr("fill", (d) =>
          d.data.kind === values.type && d.data.data.id === values.id
            ? "green"
            : d.data.kind === "big_paint"
              ? "blue"
              : "purple",
        )
        .on("click", (e, n) => {
          setPopoverData(n.data);
          setPopoverOpen(true);
        });

      node.append("title").text((d) => d.data.data.id);

      return () => {
        svg.remove();
      };
    }
  }, [query.data]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverData, setPopoverData] = useState<Node["data"]>();

  return (
    <div ref={ref} className="h-[calc(100vh-8rem)]">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal>
        <PopoverContent className="flex h-full w-full justify-center bg-black/95 pb-32 backdrop-blur">
          {/* TODO: Possibilità di focus e un indicatore in alto a destra che ti dice che puoi uscire tramite questo */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            ref={popoverContentRef}
            className="w-full max-w-4xl"
            onClick={(e) => {
              if (
                e.target === popoverContentRef.current ||
                e.target === ref2.current
              )
                setPopoverOpen(false);
            }}
          >
            <div className="h-12 w-full" ref={ref2} />

            {/* TODO: popoverData !== undefined or popoverOpen or maybe both */}
            {popoverData !== undefined && popoverData.kind === "big_paint" && (
              <UIBigPaint data={popoverData.data} />
            )}
            {popoverData !== undefined &&
              popoverData.kind === "inspiration" && (
                <UIInspiration data={popoverData.data} />
              )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
