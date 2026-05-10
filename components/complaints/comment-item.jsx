import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { CommentComposer } from '@/components/complaints/comment-composer';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useCommentReplies } from '@/hooks/useCommentReplies';
import { formatDate } from '@/utils/date.utils';

const formatRepliesLabel = (count, visible) => {
  if (visible) return 'Ocultar respostas';
  if (count === 1) return 'Mostrar 1 resposta';
  return `Mostrar ${count} respostas`;
};

function CommentBody({
  comment,
  isReply,
  onLike,
  onReply,
  styles,
}) {
  const username = comment.username || 'usuario';

  return (
    <View style={[styles.commentRow, isReply && styles.replyRow]}>
      <UserAvatar username={username} size={34} />

      <View style={styles.commentBody}>
        <View style={styles.commentBubble}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUsername}>@{username}</Text>
            <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>

        <View style={styles.commentActions}>
          <Pressable style={styles.commentActionButton} onPress={onLike}>
            <Ionicons
              name={comment.likedByMe ? 'heart' : 'heart-outline'}
              size={16}
              color={comment.likedByMe ? '#E24B4A' : '#8A8A8E'}
            />
            <Text style={styles.commentActionText}>{comment.likes || 0}</Text>
          </Pressable>

          {!isReply && (
            <Pressable style={styles.commentActionButton} onPress={onReply}>
              <Text style={styles.commentActionText}>Responder</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export function CommentItem({
  complaintId,
  comment,
  onLike,
  onReplyCreated,
  styles,
}) {
  const [replying, setReplying] = useState(false);
  const {
    visible,
    replies,
    pageInfo,
    loading,
    loadingMore,
    submitting,
    toggleVisible,
    loadMore,
    addReply,
    toggleLike,
  } = useCommentReplies({
    complaintId,
    commentId: comment.id,
    onReplyCreated,
  });

  const handleAddReply = async (text) => {
    const reply = await addReply(text);
    if (reply) {
      setReplying(false);
    }
    return reply;
  };

  return (
    <View style={styles.commentThread}>
      <CommentBody
        comment={comment}
        onLike={() => onLike(comment)}
        onReply={() => setReplying((current) => !current)}
        styles={styles}
      />

      {replying && (
        <View style={styles.replyComposerWrap}>
          <CommentComposer
            placeholder={`Responder @${comment.username || 'usuario'}`}
            submitting={submitting}
            onSubmit={handleAddReply}
            styles={styles}
          />
        </View>
      )}

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
