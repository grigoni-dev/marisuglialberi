// The map projection, shared by the one-off outline script and the site.
import { geoConicConformal } from 'd3-geo';

export const LARGHEZZA = 600;
export const ALTEZZA = 700;

/** Lambert conformal conic fitted to Italy's bounding box, with a small margin. */
export function proiezione() {
  return geoConicConformal()
    .parallels([38, 46])
    .rotate([-12.5, 0])
    .fitExtent([[20, 20], [LARGHEZZA - 20, ALTEZZA - 20]], {
      type: 'MultiPoint',
      coordinates: [[6.6, 47.1], [18.6, 36.6]],
    });
}
