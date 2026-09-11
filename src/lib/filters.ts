/**
 * Showroom filter row. Labels come from the translation dict (`t.filters`); this
 * maps each one to the base-style codes it shows. Index 0 ("All styles") shows
 * everything. The prototype's filter row was presentational — this wires it up.
 */
export const FILTER_CODES: (string[] | null)[] = [
  null, // All styles
  ["DA-01", "DA-16", "DA-18", "DA-19", "DA-21", "DA-24", "DA-26", "DA-28"], // Wide leg
  ["DA-02", "DA-14", "DA-22", "DA-23", "DA-25"], // Straight
  ["DA-03", "DA-15"], // Flare
  ["DA-14", "DA-15", "DA-19", "DA-20", "DA-22", "DA-25", "DA-29"], // High rise
  ["DA-01", "DA-15", "DA-21", "DA-29"], // Raw denim (darkest / least-processed washes)
  ["DA-04", "DA-25", "DA-29"], // Stretch
  ["DA-09", "DA-23", "DA-25"], // Women's
];
