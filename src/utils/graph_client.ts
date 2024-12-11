import UIBigPaint from "@/components/db_ui/UIBigPaint";
import UIInspiration from "@/components/db_ui/UIInspiration";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3";

export type Node = SimulationNodeDatum & {
  data:
    | {
        kind: "inspiration";
        data: Parameters<typeof UIInspiration>["0"]["data"];
      }
    | {
        kind: "big_paint";
        data: Parameters<typeof UIBigPaint>["0"]["data"];
      };
};

export type Link = SimulationLinkDatum<Node>;

export function forceDirectedTree({
  links,
  nodes,
}: {
  nodes: Node[];
  links: Link[];
}) {
  // TODO: Si potrebbe usare una forza aggiuntiva nei node singoli che respingono gli altri e la si potrebbe creare utilizzando la grandezza dei node e così usare react flow, ad esempio. Aspetta, mi sa che è "charge", quindi quella che già c'è
  const sim = forceSimulation<Node, Link>(nodes)
    .force(
      "link",
      forceLink<Node, Link>(links)
        .id((d) => d.data.data.id)
        .distance(0)
        .strength(1),
    )
    .force("charge", forceManyBody().strength(-2000))
    .force("x", forceX())
    .force("y", forceY())
    .force("center", forceCenter())
    .force("collide", forceCollide(20))
    // .alphaDecay(1 - Math.pow(0.001, 1 / 10))
    .stop();

  // TODO: E' possibile che questo sia relazionato a quanti nodes e links ci sono e che con un numero grande ne servano di più, forse dovrò fare la simulazione realtime. Nota: Dovrò ovviamente aggiornare la posizione dei links e dei nodes ad ogni tick
  sim.tick(300 * 10);

  return { nodes: sim.nodes(), links: links };
}
