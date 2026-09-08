# RIDER DXB — separate-file web version

Extract the whole ZIP before playing. On Windows, double-click **Start-Game.cmd**. Keep its window open while you play. It opens the game in your browser at `http://127.0.0.1:4175/`.

The launcher uses Node.js. It can also use the bundled Node.js runtime on the computer where this game was built. On macOS/Linux, run `node serve.mjs --open` from this folder.

Opening index.html directly is not supported: the game now loads separate JavaScript modules, models and textures through a local web server.

## Folder contents

- `index.html`: small entry page.
- `js/`: separate game and interface code.
- `css/`: interface styles.
- `assets/`: optimized models, character textures, road textures and animation data.
- `serve.mjs` and `Start-Game.cmd`: local preview launcher.
- `asset-report.json`: measured file sizes and checksums.

The current game retains its GS-style motorcycle, modern traffic, rider uniform, active pedestrians, staff routines and delivery mission. Saves are stored by browser and website address; a new address has a separate local save.

This step prepares the game for a website. It does not require an account or a hosting service. Later, index.html, js/, css/ and assets/ can be served by a static web host. The launcher is for local play only.
