const mergeSort = (tab, start, end, cmp) => {
  if (end - start < 2) return tab;

  const buffer = [...tab];
  const mid = Math.floor((start + end) / 2);
  mergeSort(buffer, start, mid, cmp);
  mergeSort(buffer, mid, end, cmp);

  let i = start;
  let j = mid;
  for (let k = start; k !== end; ++k) {
    if (i === mid) tab[k] = buffer[j++];
    else if (j === end) tab[k] = buffer[i++];
    else if (cmp(buffer[i], buffer[j]) <= 0) tab[k] = buffer[i++];
    else tab[k] = buffer[j++];
  }
  return tab;
};

const stableSort = (tab, cmp) => {
  return mergeSort([...tab], 0, tab.length, cmp);
};

const quickSort = (tab, start, end, cmp) => {
  if (end - start < 2) return tab;

  let pivot = start;
  for (let idx = start + 1; idx < end; ++idx) {
    if (cmp(tab[start], tab[idx]) > 0) {
      let prev = tab[++pivot];
      tab[pivot] = tab[idx];
      tab[idx] = prev;
    }
  }
  let prev = tab[pivot];
  tab[pivot] = tab[start];
  tab[start] = prev;

  quickSort(tab, start, pivot, cmp);
  quickSort(tab, pivot + 1, end, cmp);
  return tab;
};

const unstableSort = (tab, cmp) => {
  return quickSort([...tab], 0, tab.length, cmp);
};

export { stableSort, unstableSort };
