export function normalizeSeatCode(seatCode: string): string {
  return seatCode.trim().toUpperCase();
}

export function isValidSeatCode(
  seatCode: string,
  rowCount: number,
  seatsPerRow: number,
): boolean {
  const normalized = normalizeSeatCode(seatCode);
  const match = normalized.match(/^([A-Z])(\d+)$/);

  if (!match) {
    return false;
  }

  const rowIndex = match[1].charCodeAt(0) - 65;
  const seatNumber = Number.parseInt(match[2], 10);

  if (rowIndex < 0 || rowIndex >= rowCount) {
    return false;
  }

  if (seatNumber < 1 || seatNumber > seatsPerRow) {
    return false;
  }

  return true;
}

export function generateSeatList(rowCount: number, seatsPerRow: number) {
  const seats: Array<{ row: string; number: number; seatCode: string }> = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = String.fromCharCode(65 + rowIndex);

    for (let number = 1; number <= seatsPerRow; number++) {
      seats.push({
        row,
        number,
        seatCode: `${row}${number}`,
      });
    }
  }

  return seats;
}
