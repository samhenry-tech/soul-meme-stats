/**
 * Rows collage layout (same algorithm as react-photo-album's rows layout).
 * @see https://github.com/igordanchenko/react-photo-album
 */

export interface RowPhoto<T> {
  photo: T;
  index: number;
  width: number;
  height: number;
}

export interface RowTrack<T> {
  photos: RowPhoto<T>[];
}

export interface RowsLayoutModel<T> {
  spacing: number;
  padding: number;
  containerWidth: number;
  tracks: RowTrack<T>[];
}

const ratio = (photo: { width: number; height: number }) => {
  const result = photo.width / photo.height;
  return Number.isFinite(result) ? result : 1;
};

const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

function MinHeap<T>(compare: (a: T, b: T) => number) {
  let n = 0;
  const heap: T[] = [];
  /** True if i should be below j in the tree (i is larger in min-heap). */
  const greater = (i: number, j: number) => compare(heap[i]!, heap[j]!) > 0;
  const swap = (i: number, j: number) => {
    const temp = heap[i];
    heap[i] = heap[j]!;
    heap[j] = temp!;
  };
  const swim = (i: number) => {
    let k = i;
    let k2 = Math.floor(k / 2);
    while (k > 1 && greater(k2, k)) {
      swap(k2, k);
      k = k2;
      k2 = Math.floor(k / 2);
    }
  };
  const sink = (i: number) => {
    let k = i;
    let k2 = k * 2;
    while (k2 <= n) {
      if (k2 < n && greater(k2, k2 + 1)) k2 += 1;
      if (!greater(k, k2)) break;
      swap(k, k2);
      k = k2;
      k2 = k * 2;
    }
  };
  const push = (element: T) => {
    n += 1;
    heap[n] = element;
    swim(n);
  };
  const pop = () => {
    if (n === 0) return undefined;
    swap(1, n);
    n -= 1;
    const max = heap.pop();
    sink(1);
    return max;
  };
  const size = () => n;
  return { push, pop, size };
}

const TIEBREAKER_EPSILON = 1.005;

function buildPrecedentsMap(
  graph: (node: number) => Map<number, number>,
  startNode: number,
  endNode: number,
) {
  const precedentsMap = new Map<number, number>();
  const visited = new Set<number>();
  const storedShortestPaths = new Map<number, number>();
  storedShortestPaths.set(startNode, 0);
  const queue = MinHeap<[number, number]>((a, b) => a[1] - b[1]);
  queue.push([startNode, 0]);
  while (queue.size() > 0) {
    const popped = queue.pop();
    if (!popped) break;
    const [id, weight] = popped;
    if (!visited.has(id)) {
      const neighboringNodes = graph(id);
      visited.add(id);
      neighboringNodes.forEach((neighborWeight, neighbor) => {
        const newWeight = weight + neighborWeight;
        const currentId = precedentsMap.get(neighbor);
        const currentWeight = storedShortestPaths.get(neighbor);
        if (
          currentWeight === undefined ||
          (currentWeight > newWeight &&
            (currentWeight / newWeight > TIEBREAKER_EPSILON ||
              (currentId !== undefined && currentId < id)))
        ) {
          storedShortestPaths.set(neighbor, newWeight);
          queue.push([neighbor, newWeight]);
          precedentsMap.set(neighbor, id);
        }
      });
    }
  }
  return storedShortestPaths.has(endNode) ? precedentsMap : undefined;
}

function getPathFromPrecedentsMap(
  precedentsMap: Map<number, number> | undefined,
  endNode: number,
) {
  if (!precedentsMap) return undefined;
  const nodes: number[] = [];
  for (let node: number | undefined = endNode; node !== undefined; node = precedentsMap.get(node)) {
    nodes.push(node);
  }
  return nodes.reverse();
}

function findShortestPath(
  graph: (node: number) => Map<number, number>,
  startNode: number,
  endNode: number,
) {
  return getPathFromPrecedentsMap(
    buildPrecedentsMap(graph, startNode, endNode),
    endNode,
  );
}

function findIdealNodeSearch<T extends { width: number; height: number }>(
  photos: readonly T[],
  containerWidth: number,
  targetRowHeight: number,
  minPhotos: number | undefined,
) {
  return (
    round(
      containerWidth /
        targetRowHeight /
        Math.min(...photos.map((photo) => ratio(photo))),
    ) +
    (minPhotos ?? 0) +
    2
  );
}

function getCommonHeight<T extends { width: number; height: number }>(
  photos: readonly T[],
  containerWidth: number,
  spacing: number,
  padding: number,
) {
  return (
    (containerWidth -
      (photos.length - 1) * spacing -
      2 * padding * photos.length) /
    photos.reduce((acc, photo) => acc + ratio(photo), 0)
  );
}

function cost<T extends { width: number; height: number }>(
  photos: readonly T[],
  i: number,
  j: number,
  width: number,
  spacing: number,
  padding: number,
  targetRowHeight: number,
) {
  const row = photos.slice(i, j);
  const commonHeight = getCommonHeight(row, width, spacing, padding);
  return commonHeight > 0
    ? (commonHeight - targetRowHeight) ** 2 * row.length
    : undefined;
}

function makeGetRowNeighbors<T extends { width: number; height: number }>(
  photos: readonly T[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetRowHeight: number,
  limitNodeSearch: number,
  minPhotos: number | undefined,
  maxPhotos: number | undefined,
) {
  return (node: number) => {
    const results = new Map<number, number>();
    results.set(node, 0);
    const startOffset = Math.max(1, minPhotos ?? 0);
    const endOffset = Math.min(limitNodeSearch, maxPhotos ?? Infinity);
    for (let k = node + startOffset; k < photos.length + 1; k += 1) {
      if (k - node > endOffset) break;
      const currentCost = cost(photos, node, k, containerWidth, spacing, padding, targetRowHeight);
      if (currentCost === undefined) break;
      results.set(k, currentCost);
    }
    return results;
  };
}

export function computeRowsLayout<T extends { width: number; height: number }>(
  photos: readonly T[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetRowHeight: number,
  minPhotos: number | undefined,
  maxPhotos: number | undefined,
): RowsLayoutModel<T> | undefined {
  if (photos.length === 0) {
    return {
      spacing,
      padding,
      containerWidth,
      tracks: [],
    };
  }

  const limitNodeSearch = findIdealNodeSearch(
    photos,
    containerWidth,
    targetRowHeight,
    minPhotos,
  );
  const getNeighbors = makeGetRowNeighbors(
    photos,
    spacing,
    padding,
    containerWidth,
    targetRowHeight,
    limitNodeSearch,
    minPhotos,
    maxPhotos,
  );
  const path = findShortestPath(getNeighbors, 0, photos.length);
  if (!path) return undefined;
  const tracks: RowTrack<T>[] = [];
  for (let i = 1; i < path.length; i += 1) {
    const rowStart = path[i - 1]!;
    const rowEnd = path[i]!;
    const row = photos
      .slice(rowStart, rowEnd)
      .map((photo, j) => ({ photo, index: rowStart + j }));
    const height = getCommonHeight(
      row.map(({ photo }) => photo),
      containerWidth,
      spacing,
      padding,
    );
    tracks.push({
      photos: row.map(({ photo, index }) => ({
        photo,
        index,
        width: height * ratio(photo),
        height,
      })),
    });
  }
  return { spacing, padding, containerWidth, tracks };
}

export function layoutTotalHeight<T>(
  tracks: RowTrack<T>[],
  rowGap: number,
): number {
  if (tracks.length === 0) return 0;
  let sum = 0;
  for (const t of tracks) {
    sum += t.photos[0]?.height ?? 0;
  }
  sum += (tracks.length - 1) * rowGap;
  return sum;
}

/**
 * Prefer the largest target row height whose layout still fits in maxHeight (bigger thumbnails).
 * Falls back to a default layout scaled down with scale &lt; 1 if nothing fits.
 */
export function fitCollageRowsLayout<T extends { width: number; height: number }>(
  photos: readonly T[],
  containerWidth: number,
  maxHeight: number,
  spacing: number,
  padding = 0,
): { tracks: RowTrack<T>[]; scale: number; targetRowHeight: number } {
  if (photos.length === 0 || containerWidth <= 0 || maxHeight <= 0) {
    return { tracks: [], scale: 1, targetRowHeight: 0 };
  }

  const maxTarget = Math.min(maxHeight, containerWidth, 600);
  let best: RowsLayoutModel<T> | undefined;
  let bestTarget = -1;

  const steps = 72;
  for (let s = 0; s <= steps; s += 1) {
    const target = 8 + (s / steps) * (maxTarget - 8);
    const layout = computeRowsLayout(
      photos,
      spacing,
      padding,
      containerWidth,
      target,
      undefined,
      undefined,
    );
    if (!layout) continue;
    const th = layoutTotalHeight(layout.tracks, spacing);
    if (th <= maxHeight && target > bestTarget) {
      best = layout;
      bestTarget = target;
    }
  }

  if (best && best.tracks.length > 0) {
    const th = layoutTotalHeight(best.tracks, spacing);
    const scale = th > 0 ? Math.min(1, maxHeight / th) : 1;
    return { tracks: best.tracks, scale, targetRowHeight: bestTarget };
  }

  const fallbackTarget = Math.max(12, containerWidth / 6);
  const layout = computeRowsLayout(
    photos,
    spacing,
    padding,
    containerWidth,
    fallbackTarget,
    undefined,
    undefined,
  );
  if (!layout || layout.tracks.length === 0) {
    return { tracks: [], scale: 1, targetRowHeight: fallbackTarget };
  }
  const th = layoutTotalHeight(layout.tracks, spacing);
  const scale = th > 0 ? Math.min(1, maxHeight / th) : 1;
  return { tracks: layout.tracks, scale, targetRowHeight: fallbackTarget };
}
