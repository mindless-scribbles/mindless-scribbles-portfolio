# Point Cloud Pipeline: Maya → Web

Goal: turn a 3D asset (model, sculpt, or scan of yourself) into a `.pcd` or `.ply` point cloud
loadable by Three.js on the site.

---

## Target formats

| Format | Three.js Loader | Notes |
|---|---|---|
| `.pcd` | `PCDLoader` | Current loader in `ThreeBackground.tsx` |
| `.ply` | `PLYLoader` | Easier to export from DCC tools — one-line swap in code |

**Recommendation: use PLY.** More common in the 3D art world, MeshLab exports it natively,
and Three.js handles it just as well.

---

## Pipeline A — From a Maya mesh (model/sculpt of yourself)

Maya doesn't export PCD/PLY natively. Use **MeshLab** (free) to bridge:

1. **Maya** → `File > Export All` → `.obj`
2. **MeshLab** → `File > Import Mesh` → open the OBJ
3. Sample the surface into points:
   `Filters > Sampling > Poisson-disk Sampling`
   - Sample count: **100k–300k** points (good balance of detail vs. web load time)
   - This distributes points evenly across the surface, not just at vertices
4. `File > Export Mesh As` → **PLY**, binary encoding (smaller file size)

---

## Pipeline B — Scanning yourself directly (recommended)

Gives you real spatial scan data with no mesh-to-points conversion step.
The organic, imperfect nature of a real scan looks better as a point cloud than
a clean mesh does.

- **iPhone LiDAR**: **Polycam**, **Scaniverse**, or **Record3D** → export directly as `.ply`
- **Photogrammetry** (Metashape / RealityCapture): process → export point cloud as `.ply` or `.pcd`
- **Pro gear** (FARO, Artec): exports PCD / PLY / E57 natively

---

## Web-ready prep (MeshLab or CloudCompare)

Before dropping the file on the site:

1. **Center and normalize** — center the geometry at origin, scale to roughly unit size
2. **Clean up noise** — remove isolated floating points
   `Filters > Cleaning and Repairing > Remove Isolated Pieces`
3. **Decimate if needed** — keep under ~500k points for reasonable web load time
4. **Export as binary** (not ASCII) — dramatically smaller file

---

## Dropping it into the site

1. Place the file at `public/models/yourname.ply` (or `.pcd`)
2. In `src/components/lumo/ThreeBackground.tsx`:

**If using PLY** (swap loader):
```tsx
// Replace:
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
// With:
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
```
Then update the load call — PLYLoader returns a `BufferGeometry`, not a `Points` object,
so you wrap it yourself:
```tsx
loader.load('/models/yourname.ply', (geometry) => {
    geometry.center();
    const material = new THREE.PointsMaterial({ size: 0.005, color: 0x1A1817 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
});
```

**If using PCD** (just change path):
```tsx
loader.load('/models/yourname.pcd', (points) => { ... });
```

---

## Point count guidelines

| Points | Quality | Load time (rough) |
|---|---|---|
| 50k | Low, impressionistic | Very fast |
| 150k | Good for head/bust | Fast |
| 300k | High detail | Acceptable |
| 500k+ | Very high | Gets heavy |

For a head/bust scan, 150k–250k is the sweet spot.
