import { StyleSheet } from 'react-native';
import { containerStyles } from './container.styles';
import { searchStyles } from './search.styles';
import { buttonsStyles } from './buttons.styles';
import { bottomCardStyles } from './bottom-card.styles';

export const mapScreenStyles = (colorScheme) => {
  return StyleSheet.create({
    ...containerStyles(colorScheme),
    ...searchStyles(colorScheme),
    ...buttonsStyles(colorScheme),
    ...bottomCardStyles(colorScheme),
  });
};
