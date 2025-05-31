import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@lexora/styles';

interface ButtonProps {
  onPress?: () => void;
  text: string;
  disabled?: boolean;
  theme?: 'purple' | 'green' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export function Button({
  onPress,
  text,
  disabled = false,
  theme = 'green',
  style,
}: ButtonProps) {
  const { containerStyle, textStyle } = getStylesByTheme(theme, disabled);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, containerStyle, disabled && styles.disabled, style]}
    >
      <Text style={[styles.textBase, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const getStylesByTheme = (
  theme: ButtonProps['theme'],
  disabled: ButtonProps['disabled']
): {
  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
} => {
  if (disabled) {
    return {
      containerStyle: {
        backgroundColor: Colors.disabled,
      },
      textStyle: {
        color: Colors.textDark,
      },
    };
  }

  switch (theme) {
    case 'purple':
      return {
        containerStyle: {
          backgroundColor: Colors.accent,
        },
        textStyle: {
          color: Colors.textDark,
        },
      };
    case 'green':
      return {
        containerStyle: {
          backgroundColor: Colors.actionButton,
        },
        textStyle: {
          color: Colors.textDark,
        },
      };

    case 'outline':
    default:
      return {
        containerStyle: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.accent,
        },
        textStyle: {
          color: Colors.accent,
        },
      };
  }
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: 'center',
  },
  textBase: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
  },
  disabled: {
    opacity: 0.5,
  },
});
