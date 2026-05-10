import { CommentItem } from '@/components/complaints/comment-item';
import { Pressable, Text, View } from 'react-native';

export function CommentsSection({
  complaintId,
  comments,
  totalComments,
  pageInfo,
  loading,
  loadingMore,
  loadMore,
  toggleLike,
  incrementRepliesCount,
  onLayout,
  styles,
}) {
  return (
    <View style={styles.commentsSection} onLayout={onLayout}>
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Comentários</Text>
        <Text style={styles.commentsCount}>({totalComments})</Text>
      </View>

      {loading && comments.length === 0 ? (
        <Text style={styles.commentsStateText}>Carregando comentários...</Text>
      ) : comments.length === 0 ? (
        <Text style={styles.commentsStateText}>
          Ainda não há comentários. Seja o primeiro a comentar.
        </Text>
      ) : (
        <View style={styles.commentsList}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              complaintId={complaintId}
              comment={comment}
              onLike={toggleLike}
              onReplyCreated={incrementRepliesCount}
              styles={styles}
            />
          ))}
        </View>
      )}

      {pageInfo?.hasMore && (
        <Pressable
          style={styles.moreCommentsButton}
          onPress={loadMore}
          disabled={loadingMore}
        >
          <Text style={styles.moreCommentsText}>
            {loadingMore ? 'Carregando...' : 'Ver mais comentários'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
