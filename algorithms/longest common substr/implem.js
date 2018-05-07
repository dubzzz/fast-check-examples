const longestCommonSubstr = (s1, s2) => {
  const helper = [...s1].map(_ => [...s2].map(_ => 0));

  let maxStart = 0;
  let maxLength = 0;
  for (let idx1 = 0; idx1 !== s1.length; ++idx1) {
    for (let idx2 = 0; idx2 !== s2.length; ++idx2) {
      if (s1[idx1] !== s2[idx2]) continue;
      const length = idx1 > 0 && idx2 > 0 ? helper[idx1 - 1][idx2 - 1] + 1 : 1;
      helper[idx1][idx2] = length;
      if (length > maxLength) {
        maxStart = idx1 - length + 1;
        maxLength = length;
      }
    }
  }
  return s1.substr(maxStart, maxLength);
};

export { longestCommonSubstr };
