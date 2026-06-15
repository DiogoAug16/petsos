export const detailCommentsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  const text = isDark ? '#fff' : '#272A3A';
  const muted = '#8D7D78';
  const border = isDark ? '#F0D8BF' : '#F0D8BF';
  const soft = isDark ? '#F0D8BF' : '#FFF6EC';

  return {
    commentsSection: {
      paddingHorizontal: 14,
      paddingTop: 4,
      paddingBottom: 20,
      gap: 12,
    },
    commentsHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
    },
    commentsTitle: {
      color: text,
      fontSize: 18,
      fontWeight: '800',
    },
    commentsCount: {
      color: muted,
      fontSize: 15,
      fontWeight: '700',
    },
    detailCommentInputBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 12,
      backgroundColor: isDark ? '#FFF6EC' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: border,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
    },
    commentComposer: {
      minHeight: 46,
      backgroundColor: soft,
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: border,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      padding: 8,
    },
    commentInput: {
      flex: 1,
      maxHeight: 92,
      color: text,
      fontSize: 14,
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    commentSendButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF9F1C',
    },
    commentSendButtonDisabled: {
      opacity: 0.45,
    },
    commentsStateText: {
      color: muted,
      fontSize: 13,
      lineHeight: 19,
      paddingVertical: 4,
    },
    commentComposerAnchor: {
      height: 1,
      width: '100%',
    },
    commentsBlockedBox: {
      gap: 8,
      paddingVertical: 6,
    },
    commentsBlockedTitle: {
      color: text,
      fontSize: 15,
      fontWeight: '800',
    },
    commentsBlockedText: {
      color: muted,
      fontSize: 13,
      lineHeight: 19,
    },
    commentsBlockedButton: {
      alignSelf: 'flex-start',
      minHeight: 36,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: '#FF9F1C',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    commentsBlockedButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '900',
    },
    commentsList: {
      gap: 14,
    },
    commentThread: {
      gap: 8,
    },
    commentRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },
    replyRow: {
      marginLeft: 34,
    },
    commentBody: {
      flex: 1,
      gap: 6,
    },
    commentBubble: {
      backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
      borderRadius: 14,
      padding: 10,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },
    commentUsername: {
      color: text,
      fontSize: 13,
      fontWeight: '800',
    },
    commentDate: {
      color: muted,
      fontSize: 11,
    },
    commentText: {
      color: text,
      fontSize: 14,
      lineHeight: 20,
    },
    commentMentionText: {
      color: '#FF9F1C',
      fontWeight: '800',
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingLeft: 4,
    },
    commentActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      minHeight: 24,
    },
    commentActionText: {
      color: muted,
      fontSize: 12,
      fontWeight: '700',
    },
    showRepliesButton: {
      marginLeft: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 28,
    },
    showRepliesLine: {
      width: 24,
      height: 1,
      backgroundColor: border,
    },
    showRepliesText: {
      color: muted,
      fontSize: 12,
      fontWeight: '700',
    },
    repliesList: {
      gap: 10,
    },
    moreRepliesButton: {
      marginLeft: 78,
      minHeight: 30,
      justifyContent: 'center',
    },
    moreRepliesText: {
      color: '#FF9F1C',
      fontSize: 12,
      fontWeight: '800',
    },
    moreCommentsButton: {
      minHeight: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: soft,
      borderWidth: 0.5,
      borderColor: border,
    },
    moreCommentsText: {
      color: '#FF9F1C',
      fontSize: 13,
      fontWeight: '800',
    },
  };
};
