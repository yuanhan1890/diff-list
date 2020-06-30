# Diff list

Implementing [myers diff algorithm](https://www.google.com/search?q=myers+algorithm)

## usage

```typescript
import { diffList, DiffType } from "../src/diff-list-myers"

const stopChanges = diffList({
  before: [{
    stopId: "1",
    stopName: "A",
  }, {
    stopId: "2",
    stopName: "B",
  }, {
    stopId: "3",
    stopName: "C",
  }],
  after: [{
    stopId: "1",
    stopName: "A",
  }, {
    stopId: "3",
    stopName: "C1",
  }, {
    stopId: "4",
    stopName: "D",
  }],
  getId(s) {
    return s.stopId;
  }
});


/*
  expect stopChanges to be:

  [
  {
    "after": {
      "stopId": "1",
      "stopName": "A"
    },
    "before": {
      "stopId": "1",
      "stopName": "A"
    },
    "id": "1",
    "type": DiffType.normal,
  },
  {
    "before": {
      "stopId": "2",
      "stopName": "B"
    },
    "id": "2",
    "type": DiffType.deleted
  },
  {
    "after": {
      "stopId": "3",
      "stopName": "C1"
    },
    "before": {
      "stopId": "3",
      "stopName": "C"
    },
    "id": "3",
    "type": DiffType.normal,
  },
  {
    "after": {
      "stopId": "4",
      "stopName": "D"
    },
    "id": "4",
    "type": DiffType.created,
  }
]
 */
```
