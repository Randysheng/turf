import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import Benchmark from "benchmark";
import { loadJsonFileSync } from "load-json-file";
import { booleanConcave as concave } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Benchmark Results
 * 3vertices x 9,177,672 ops/sec ±0.67% (89 runs sampled)
 * diamond x 2,989,753 ops/sec ±0.14% (92 runs sampled)
 * square x 3,322,185 ops/sec ±0.20% (91 runs sampled)
 * polygon x 3,422,036 ops/sec ±0.42% (91 runs sampled)
 * polygon2 x 2,412,660 ops/sec ±1.66% (85 runs sampled)
 */
const suite = new Benchmark.Suite("turf-boolean-is-concave");
glob
  .sync(path.join(__dirname, "test", "**", "*.geojson"))
  .forEach((filepath) => {
    const { name } = path.parse(filepath);
    const geojson = loadJsonFileSync(filepath);
    const [feature] = geojson.features;
    suite.add(name, () => concave(feature));
  });

suite.on("cycle", (e) => console.log(String(e.target))).run();
