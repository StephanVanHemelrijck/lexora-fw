export function getCefrLevelLabel(level: string): string {
  const normalizedLevel = level.trim().toUpperCase();

  switch (normalizedLevel) {
    case 'A1':
      return 'Beginner';
    case 'A2':
      return 'Elementary';
    case 'B1':
      return 'Intermediate';
    case 'B2':
      return 'Upper-Intermediate';
    case 'C1':
      return 'Advanced';
    case 'C2':
      return 'Proficient';
    default:
      return '';
  }
}
