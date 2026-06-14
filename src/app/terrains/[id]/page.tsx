import { TerrainDetailsClient } from "./terrain-details-client";

export default async function TerrainDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TerrainDetailsClient terrainId={id} />;
}
