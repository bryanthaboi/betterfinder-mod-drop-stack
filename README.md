# betterfinder-mod-drop-stack

[![release](https://img.shields.io/github/v/release/bryanthaboi/betterfinder-mod-drop-stack)](https://github.com/bryanthaboi/betterfinder-mod-drop-stack/releases)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![betterfinder](https://img.shields.io/badge/betterfinder-mod-8a5cf6)](https://github.com/bryanthaboi/betterfinder)

path finder style drop stack. stash files from anywhere, browse around, then copy or move the whole pile somewhere in one go.

## grants

- `fs.read`: selection, to hold the files u stash
- `fs.write`: destination, the folder u pick when dropping
- `storage`: remembers the stack
- `ui`: panel, context menu, toolbar

right click, add to drop stack. open the panel, hit copy or move, pick the folder. name clashes get renamed, nothing is overwritten. if the app invalidated the handles (restart) it tells u to restash instead of guessing.

## install

browse tab in betterfinder settings, or grab `drop-stack.bfmod` from the [latest release](https://github.com/bryanthaboi/betterfinder-mod-drop-stack/releases/latest). nothing turns on until u approve the grants.

## build it urself

```sh
betterfinder-mod validate .
betterfinder-mod package . --out drop-stack.bfmod
```

mit. do whatever.
