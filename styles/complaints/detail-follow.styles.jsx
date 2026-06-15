export const detailFollowStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  const card = isDark ? '#FFFCF7' : '#FFFFFF';
  const text = '#272A3A';
  const muted = '#8D7D78';
  const border = isDark ? '#F0D8BF' : '#F0D8BF';
  const soft = isDark ? '#F0D8BF' : '#FFF6EC';

  return {
    detailFollowSummary: {
      marginHorizontal: 14,
      marginTop: 10,
      marginBottom: 4,
      minHeight: 38,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    followersSummaryButton: {
      minHeight: 36,
      justifyContent: 'center',
    },
    followersSummaryText: {
      color: muted,
      fontSize: 13,
      fontWeight: '800',
    },
    detailFollowButton: {
      minWidth: 112,
      minHeight: 36,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: isDark ? '#fff' : '#272A3A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailFollowButtonActive: {
      backgroundColor: '#000',
      borderWidth: 1.5,
      borderColor: '#fff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 4,
    },
    detailFollowButtonDisabled: {
      opacity: 0.65,
    },
    detailFollowButtonText: {
      color: '#000',
      fontSize: 13,
      fontWeight: '800',
    },
    detailFollowButtonActiveText: {
      color: '#fff',
    },
    unfollowModalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    unfollowModalCard: {
      backgroundColor: card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 18,
      paddingBottom: 28,
    },
    unfollowModalTitle: {
      color: text,
      fontSize: 18,
      fontWeight: '800',
    },
    unfollowModalText: {
      color: muted,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 8,
    },
    unfollowModalActions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },
    unfollowCancelButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: soft,
    },
    unfollowCancelText: {
      color: text,
      fontSize: 14,
      fontWeight: '700',
    },
    unfollowConfirmButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E24B4A',
    },
    unfollowConfirmText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    followersModalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    followersModalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    followersModalCard: {
      maxHeight: '62%',
      backgroundColor: card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 18,
      paddingBottom: 24,
    },
    followersModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
    },
    followersModalTitle: {
      color: text,
      fontSize: 18,
      fontWeight: '800',
    },
    followersModalSubtitle: {
      color: muted,
      fontSize: 13,
      marginTop: 2,
    },
    followersModalCloseButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    followersModalList: {
      maxHeight: 320,
    },
    followersModalRow: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: border,
    },
    followersModalUsername: {
      color: text,
      fontSize: 14,
      fontWeight: '700',
    },
    followersEmpty: {
      color: muted,
      fontSize: 13,
      lineHeight: 18,
    },
  };
};
