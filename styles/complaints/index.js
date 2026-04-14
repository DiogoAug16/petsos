import { StyleSheet } from 'react-native';
import { containerStyles } from './container.styles';
import { headerStyles } from './header.styles';
import { listStyles } from './list.styles';
import { cardStyles } from './card.styles';
import { badgeStyles } from './badges.styles';
import { statesStyles } from './states.styles';
import { searchStyles } from './search.styles';
import { heroStyles } from './hero.styles';
import { infoBarStyles } from './info-bar.styles';
import { detailCardsStyles } from './detail-cards.styles';
import { actionsStyles } from './actions.styles';
import { toastStyles } from './toast.styles';

export const complaintsStyles = (colorScheme) => {
  return StyleSheet.create({
    ...containerStyles(colorScheme),
    ...headerStyles(colorScheme),
    ...listStyles(colorScheme),
    ...cardStyles(colorScheme),
    ...badgeStyles(colorScheme),
    ...statesStyles(colorScheme),
    ...searchStyles(colorScheme),
    ...heroStyles(colorScheme),
    ...infoBarStyles(colorScheme),
    ...detailCardsStyles(colorScheme),
    ...actionsStyles(colorScheme),
    ...toastStyles(colorScheme),
  });
};
