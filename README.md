Boop is an offline sample generator that runs in a web browser. It uses the core design of my [FMC Amiga](https://github.com/j5v/FMC-Amiga) synth.

[Boop homepage](https://johnvalentine.co.uk/?art=boop)

Example: This graph generates a sine wave, scales it with an envelope, and sends it to the output.

![](docs/example1.png)

# Toolchain

This is a web browser app, built in JavaScript with Vite, React, and Zustand.

Find visual components in `/components`, with subfolders `graph` (SVG), `inspector`, `layout`, and `generic`. A design system would be more thorough.

There are currently no tests included here, pending a choice of tools.

# Aims

1. Accessible and localizable.
2. Modular node types.
3. Prioritize readability and simplicity over real-time synthesis.