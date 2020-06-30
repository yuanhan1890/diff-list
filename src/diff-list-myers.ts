export enum DiffType {
  normal = "normal",
  deleted = "deleted",
  created = "created",
}

export type DiffValue<T> = ({
  id: string,
  before: T,
  type: DiffType.deleted,
}) | ({
  id: string,
  before: T,
  after: T,
  type: DiffType.normal,
}) | ({
  id: string,
  after: T,
  type: DiffType.created,
});

// myers algorithm
export function diffList<T>(props: {
  before: T[],
  after: T[],
  getId(v: T): string,
}) {
  const { before, after, getId } = props;
  const n = before.length;
  const m = after.length;
  const max = n + m;

  const trace = [] as Array<{ [key in number]: number }>;
  let x: number;
  let y: number;

  loop: for (let d = 0; d <= max; d += 1) {
    const v = {} as { [key in number]: number };
    trace.push(v);

    if (d === 0) {
      let t = 0;
      while (
        t < before.length &&
        t < after.length &&
        getId(before[t]) === getId(after[t])
      ) {
        t += 1;
      }

      v[0] = t;
      if (t === before.length && t === after.length) {
        break loop;
      }

      continue;
    }

    const lastV = trace[d - 1];

    for (let k = -d; k <= d; k += 2) {
      if (k === -d || (k !== d && lastV[k - 1] < lastV[k + 1])) {
        // down
        x = lastV[k + 1];
      } else {
        // right
        x = lastV[k - 1] + 1;
      }

      y = x - k;

      while (
        x < n &&
        y < m &&
        getId(before[x]) === getId(after[y])
      ) {
        x += 1;
        y += 1;
      }

      v[k] = x;

      if (x === n && y === m) {
        break loop;
      }
    }
  }

  const operations = [] as DiffType[];
  x = n;
  y = m;
  let k: number;
  for (let d = trace.length - 1; d > 0; d -= 1) {
    k = x - y;
    const lastV = trace[d - 1];
    let prevK: number;
    if (k === -d || (k !== d && lastV[k - 1] < lastV[k + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = lastV[prevK];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      operations.push(DiffType.normal);
      x -= 1;
      y -= 1;
    }

    if (x === prevX) {
      operations.push(DiffType.created);
    } else {
      operations.push(DiffType.deleted);
    }

    x = prevX;
    y = prevY;
  }

  if (trace[0][0] !== 0) {
    for (let i = 0; i < trace[0][0]; i += 1) {
      operations.push(DiffType.normal);
    }
  }

  operations.reverse();

  let srcIdx = 0;
  let dstIdx = 0;
  const arr = [] as Array<DiffValue<T>>;
  operations.forEach((type) => {
    switch (type) {
      case DiffType.created:
        arr.push({
          id: getId(after[dstIdx]),
          after: after[dstIdx],
          type,
        });
        dstIdx += 1;
        break;
      case DiffType.normal:
        arr.push({
          id: getId(after[dstIdx]),
          before: before[srcIdx],
          after: after[dstIdx],
          type,
        });
        srcIdx += 1;
        dstIdx += 1;
        break;
      case DiffType.deleted:
        arr.push({
          id: getId(before[srcIdx]),
          before: before[srcIdx],
          type,
        });
        srcIdx += 1;
        break;
    }
  });

  return arr;
}
