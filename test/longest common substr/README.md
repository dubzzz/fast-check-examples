# Longest common substring

## Algorithm

Given two strings **s1** and **s2** the algorithm should return the longest common substring.

## Properties

### [A] should find the same substring length whatever the order 

    for any strings `s1` and `s2`
    longestCommonSubstr(`s1`, `s2`).length should be identical to longestCommonSubstr(`s2`, `s1`).length

### [B] should include the substr in both strings

    for any strings `s1` and `s2`
    longestCommonSubstr(`s1`, `s2`) should be a substring of `s1`
    longestCommonSubstr(`s1`, `s2`) should be a substring of `s2`

### [C] should detect the longest common

    for any strings `s`, `prefix` and `suffix`
    longestCommonSubstr(`s`, `prefix` + `s` + `suffix`) should be `s`
