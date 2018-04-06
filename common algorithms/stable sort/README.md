# Stable sort

## Algorithm

A stable sort is a **sorting** algorithm **keeping the relative order** of two equivalent elements. If records A and B are equivalents - *according to the comparison function* - then if A appears before B in the input it should appear before in the output too.

The main consequence is that stable sorts can be applied consecutively: `data.sort((a,b) => a.key1-b.key1).sort((a,b) => a.key2-b.key2)` is equivalent to `data.sort((a,b) => a.key2===b.key2 ? a.key1-b.key1 : a.key2-b.key2)`.

## Properties

### [A] should contain the same items

    for any array `data`
    `data` and sort(`data`) should contain the same items (same number of each too)

### [B] should produce ordered array

    for any array `data`
    two consecutive items of sort(`data`) should be ordered

    in other words:
    
    for all i
    sort(`data`)[i] should be inferior to sort(`data`)[i+1]

### [C] should be stable

    for any array `data`
    applying comparators consecutively should be equivalent to apply a single combined comparator