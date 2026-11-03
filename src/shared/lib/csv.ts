/** Quote every field and neutralize spreadsheet formulas, including leading whitespace. */
export function createCsv(rows: readonly (readonly unknown[])[]) {
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return '\ufeff' + rows.map((row) => row.map(cell).join(',')).join('\r\n');
}
export function downloadCsv(
  name: string,
  rows: readonly (readonly unknown[])[],
) {
  const url = URL.createObjectURL(
    new Blob([createCsv(rows)], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
