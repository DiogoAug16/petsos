import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { MentionText } from '@/components/ui/MentionText';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { UserLink } from '@/components/ui/UserLink';
import { useCommentReplies } from '@/hooks/complaints/useCommentReplies';
import { formatDate } from '@/utils/shared/date.utils';

const formatRepliesLabel = (count, visible) => {
  if (visible) return 'Ocultar respostas';
  if (count === 1) return 'Mostrar 1 resposta';
  return `Mostrar ${count} respostas`;
};

const getUsername = (comment) => comment?.username || 'usuario';

function CommentBody({ comment, isReply, onLike, onReply, onReport, styles }) {
  const username = getUsername(comment);

  return (
    <View style={[styles.commentRow, isReply && styles.replyRow]}>
      <UserLink username={username}>
        <UserAvatar username={username} size={34} />
      </UserLink>

      <View style={styles.commentBody}>
        <View style={styles.commentBubble}>
          <View style={styles.commentHeader}>
            <UserLink username={username}>
              <Text style={styles.commentUsername}>@{username}</Text>
            </UserLink>
            <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
          </View>
          <MentionText
            text={comment.text}
            style={styles.commentText}
            mentionStyle={styles.commentMentionText}
          />
        </View>

        <View style={styles.commentActions}>
          <Pressable style={styles.commentActionButton} onPress={onLike}>
            <Ionicons
              name={comment.likedByMe ? 'heart' : 'heart-outline'}
              size={16}
              color={comment.likedByMe ? '#E24B4A' : '#8D7D78'}
            />
            <Text style={styles.commentActionText}>{comment.likes || 0}</Text>
          </Pressable>

          <Pressable style={styles.commentActionButton} onPress={onReply}>
            <Text style={styles.commentActionText}>Responder</Text>
          </Pressable>

          <Pressable
            style={styles.commentActionButton}
            onPress={onReport}
            accessibilityRole="button"
            accessibilityLabel="Reportar comentário"
          >
            <Ionicons name="flag-outline" size={15} color="#8D7D78" />
            <Text style={styles.commentActionText}>Reportar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function CommentItem({
  complaintId,
  comment,
  onLike,
  onReport,
  onReplyCreated,
  onReplyPress,
  styles,
}) {
  const {
    visible,
    replies,
    pageInfo,
    loading,
    loadingMore,
    toggleVisible,
    loadMore,
    addReply,
    toggleLike,
    reportReply,
  } = useCommentReplies({
    complaintId,
    commentId: comment.id,
    onReplyCreated,
  });

  const startReply = (target) => {
    onReplyPress?.({
      commentId: comment.id,
      targetId: target.id,
      username: getUsername(target),
      submitReply: addReply,
    });
  };

  return (
    <View style={styles.commentThread}>
      <CommentBody
        comment={comment}
        onLike={() => onLike(comment)}
        onReply={() => startReply(comment)}
        onReport={() => onReport(comment)}
        styles={styles}
      />

      {comment.repliesCount > 0 && (
        <Pressable style={styles.showRepliesButton} onPress={toggleVisible}>
          <View style={styles.showRepliesLine} />
          <Text style={styles.showRepliesText}>
            {loading
              ? 'Carregando respostas...'
              : formatRepliesLabel(comment.repliesCount, visible)}
          </Text>
        </Pressable>
      )}

      {visible && (
        <View style={styles.repliesList}>
          {replies.map((reply) => (
            <CommentBody
              key={reply.id}
              comment={reply}
              isReply
              onLike={() => toggleLike(reply)}
              onReply={() => startReply(reply)}
              onReport={() => reportReply(reply)}
              styles={styles}
            />
          ))}

          {pageInfo?.hasMore && (
            <Pressable
              style={styles.moreRepliesButton}
              onPress={loadMore}
              disabled={loadingMore}
            >
              <Text style={styles.moreRepliesText}>
                {loadingMore ? 'Carregando...' : 'Ver mais respostas'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
