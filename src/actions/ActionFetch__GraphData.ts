"use server";

import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import { FormValues } from "@/utils/form";
import { forceDirectedTree } from "@/utils/graph_client";
import { getGraphData } from "@/utils/graph_server";

export default async function ActionFetch__GraphData(
  values: FormValues<typeof schemaGraph__Fetch>,
) {
  const { depth, id, type, show } = schemaGraph__Fetch.parse(values);
  const graph = await getGraphData({ id, type, depth, show });
  // console.log(depth, graph);
  return forceDirectedTree({ nodes: graph.nodes, links: graph.links });
}
