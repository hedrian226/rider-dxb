# RIDER DXB — separate-file web version

Extract the whole ZIP before playing. On Windows, double-click **Start-Game.cmd**. Keep its window open while you play. It opens the game in your browser at `http://127.0.0.1:4175/`.

The launcher uses Node.js. It can also use the bundled Node.js runtime on the computer where this game was built. On macOS/Linux, run `node serve.mjs --open` from this folder.

Opening index.html directly is not supported: the game now loads separate JavaScript modules, models and textures through a local web server.

## Phones and tablets

Open the hosted game in a modern browser with WebGL 2. Touch controls appear automatically: use the joystick to walk, the steering buttons and pedals to ride, and drag the scene to look. Phone, pause, jump, run, horn, lights, mount/dismount and nearby interaction controls are available on screen. Portrait and landscape are supported. Graphics start at Low on a new touch device; you can change them in Settings.

The game fills the available browser window immediately. Starting or resuming a shift requests true fullscreen. Browsers generally require a tap and some mobile browsers restrict fullscreen; the game remains playable if the request is declined. Use the fullscreen button to try again, or use your browser's Add to Home Screen option and open the saved icon for an app view. A Home Screen shortcut still needs an internet connection; this version does not add offline caching.

Settings → Gameplay → Touch controls can force the controls On or Off, or keep automatic detection.

## Folder contents

- `index.html`: small entry page.
- `js/`: separate game and interface code.
- `css/`: interface styles.
- `assets/`: optimized models, character textures, road textures and animation data.
- `serve.mjs` and `Start-Game.cmd`: local preview launcher.
- `asset-report.json`: measured file sizes and checksums.

The current game retains its GS-style motorcycle, modern traffic, rider uniform, active pedestrians, staff routines and delivery mission. Saves are stored by browser and website address; a new address has a separate local save.

For GitHub/Vercel, upload index.html, app.webmanifest, js/, css/, assets/ and the credit/license files together. With Vercel choose Other, no build command, and output directory `.` for this prebuilt package. The launcher is for local play only. Saves remain on each browser/device.
