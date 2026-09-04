/**
 * Showroom filter row. Labels come from the translation dict (`t.filters`); this
 * maps each one to the base-style codes it shows. Index 0 ("All styles") shows
 * everything. The prototype's filter row was presentational — this wires it up.
 */
export const FILTER_CODES: (string[] | null)[] = [
  null, // All styles
  ["DA-01", "DA-07", "DA-08", "DA-10"], // Wide leg
  ["DA-02", "DA-10", "DA-13"], // Straight
  ["DA-03"], // Flare
  ["DA-08", "DA-09", "DA-10"], // High rise
  ["DA-06"], // Raw denim
  ["DA-04", "DA-12"], // Stretch (moto stretch skinny; carpenter offers stretch base)
  ["DA-08", "DA-09"], // Women's
];
