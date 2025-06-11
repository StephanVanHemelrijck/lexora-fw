export function getCefrLevelLabel(level: string): string {
  const normalizedLevel = level.trim().toUpperCase();

  switch (normalizedLevel) {
    case 'A1':
      return 'A1 - Beginner';
    case 'A2':
      return 'A2 - Elementary';
    case 'B1':
      return 'B1 - Intermediate';
    case 'B2':
      return 'B2 - Upper-Intermediate';
    case 'C1':
      return 'C1 - Advanced';
    case 'C2':
      return 'C2 - Proficient';
    default:
      return '';
  }
}
