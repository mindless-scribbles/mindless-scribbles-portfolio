---
title: "Reaction Diffusion Systems"
titleLine1: "Reaction"
titleLine2: "Diffusion Systems"
slug: reaction-diffusion-systems
ref: RD_SYS_004
specs:
  technology: GLSL / TOPs
  fps: 60 FPS @ 4K
  compute: Multi-Pass PBR
  hardware: CUDA Core Opt.
download:
  filename: REACTION_DIFFUSION.TOX
  size: 14.2 MB
  build: TD-2023.11290
  url: "#"
log:
  - date: "14.02.2024"
    desc: "Refined Laplacian kernels for increased stability at higher diffusion rates. Optimized GLSL texture lookups using textureGather."
  - date: "28.11.2023"
    desc: "Integrated optical flow feedback loop. Movement in the environment now acts as a seed for the reaction agent."
  - date: "05.09.2023"
    desc: "Initial implementation of Gray-Scott equations within TouchDesigner TOP network. Added spatial noise modulation for Feed and Kill rates."
---

A computational exploration of the Gray-Scott model, simulating the natural formation of patterns found in coral, zebra stripes, and cellular structures. This implementation utilizes a multi-pass GLSL buffer system to compute chemical concentrations in real-time.
