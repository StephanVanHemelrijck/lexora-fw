import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { LanguageJourney } from '@lexora/types';

interface Props {
  ljs: LanguageJourney[];
  selectedLj?: LanguageJourney;
  onChange: (lj: LanguageJourney) => void;
}

export default function LanguageJourneyDropdown({
  ljs,
  selectedLj,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedLj?.id ?? null);

  const items = ljs.map((lj) => ({
    label: `${lj.language.flagEmoji} ${lj.language.name}`,
    value: lj.id,
  }));

  useEffect(() => {
    const selected = ljs.find((lj) => lj.id === value);
    if (selected) onChange(selected);
  }, [value, onChange, ljs]);

  if (ljs.length === 1) {
    const lj = ljs[0];
    return (
      <View style={styles.singleItem}>
        <Text style={styles.label}>
          {lj.language.flagEmoji}
          {'  '}
          {lj.language.name}
          {'   '}
          <Text style={styles.nativeName}>{lj.language.nativeName}</Text>
        </Text>
      </View>
    );
  }

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={() => {}}
      placeholder="Select Language Journey"
      style={styles.dropdown}
      textStyle={styles.text}
      dropDownContainerStyle={styles.dropdownContainer}
      zIndex={999}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Spacing.s,
  },
  dropdownContainer: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.border,
  },
  text: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
  },
  singleItem: {
    backgroundColor: Colors.inputBackground,
    padding: Spacing.m,
    borderRadius: Spacing.s,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  nativeName: {
    fontSize: FontSizes.caption,
    color: Colors.textLight,
    fontWeight: FontWeights.regular,
  },
  label: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
});
