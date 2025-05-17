import React from 'react';
import {
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';

type IconLibrary =
  | 'Feather'
  | 'Ionicons'
  | 'FontAwesome'
  | 'MaterialIcons'
  | 'Entypo';

const iconSets = {
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Entypo,
};

type IconNameMap = {
  Feather: keyof typeof Feather.glyphMap;
  Ionicons: keyof typeof Ionicons.glyphMap;
  FontAwesome: keyof typeof FontAwesome.glyphMap;
  MaterialIcons: keyof typeof MaterialIcons.glyphMap;
  Entypo: keyof typeof Entypo.glyphMap;
};

type Props<T extends IconLibrary> = {
  library: T;
  name: IconNameMap[T];
  size?: number;
  color?: string;
};

// Generic, type-safe icon wrapper
export function Icon<T extends IconLibrary>({
  library,
  name,
  size = 24,
  color = '#fff',
}: Props<T>) {
  const Component = iconSets[library] as React.ComponentType<{
    name: string;
    size: number;
    color: string;
  }>;

  return <Component name={name as string} size={size} color={color} />;
}
