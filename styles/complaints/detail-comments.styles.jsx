export const detailCommentsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  const text = isDark ? '#fff' : '#1C1C1E';
  const muted = '#8A8A8E';
  const border = isDark ? '#3A3A3A' : '#E8E4DF';
  const soft = isDark ? '#2A2A2A' : '#F7F4F0';

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
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 10,
      backgroundColor: isDark ? '#000' : '#F7F4F0',
      borderTopWidth: 0.5,
      borderTopColor: border,
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
      backgroundColor: '#FF6B35',
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
      backgroundColor: isDark ? '#252528' : '#F7F4F0',
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
    replyComposerWrap: {
      marginLeft: 44,
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
      color: '#FF6B35',
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
      color: '#FF6B35',
      fontSize: 13,
      fontWeight: '800',
    },
  };
};
