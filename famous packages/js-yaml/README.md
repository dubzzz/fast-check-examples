# js-yaml

Total downloads: ![total downloads](https://img.shields.io/npm/dt/js-yaml.svg)

## Bug discovered using property based testing (fast-check)

**Issue detected:** enabling `!!int: binary` style when dumping negative integers produces invalid content \[[more](https://github.com/nodeca/js-yaml/pull/398)\]

**Code example:** `yaml.dump({toto: -10}, {styles:{'!!int':'binary'}})` produces `toto: 0b-1010` not `toto: -0b1010`

**Fixed at:** 3.11.0

## Properties

### [A] should be able to read itself

    for any yaml object `obj` and any options `options`
    loading back the yaml object from its dump should rebuild the yaml object

    in other words:

    for any yaml object `obj` and any dump options `options`
    fromYAML(toYAML(`obj`, `options`)) === `obj`
