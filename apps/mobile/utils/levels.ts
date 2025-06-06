export function getCefrLevelLabel(level: string | null): string {
  switch (level) {
    case null:
      return '';
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
