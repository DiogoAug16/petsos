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
import { detailCommentsStyles } from './detail-comments.styles';
import { detailFollowStyles } from './detail-follow.styles';
import { detailLayoutStyles } from './detail-layout.styles';
import { detailMenuStyles } from './detail-menu.styles';

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
    ...detailLayoutStyles(colorScheme),
    ...detailMenuStyles(colorScheme),
    ...detailFollowStyles(colorScheme),
    ...detailCommentsStyles(colorScheme),
  });
};
