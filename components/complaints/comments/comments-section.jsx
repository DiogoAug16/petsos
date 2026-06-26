import { CommentItem } from '@/components/complaints/comments/comment-item';
import { useAuthPrompt } from '@/context/AuthPromptContext';
import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';

export function CommentsSection({
  complaintId,
  comments,
  totalComments,
  pageInfo,
  loading,
  loadingMore,
  isBlocked,
  loadMore,
  toggleLike,
  incrementRepliesCount,
  onReplyPress,
  onSectionLayout,
  onComposerAnchorLayout,
  styles,
}) {
  const { openAuthPrompt } = useAuthPrompt();

  const openCommentsAuthPrompt = () => {
    openAuthPrompt({
      title: 'Entre para ver comentários',
      message:
        'Os comentários desta denúncia são visíveis apenas para usuários logados.',
    });
  };

  return (
    <View style={styles.commentsSection} onLayout={onSectionLayout}>
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Comentários</Text>
        {!isBlocked && (
          <Text style={styles.commentsCount}>({totalComments})</Text>
        )}
      </View>

      {isBlocked ? (
        <View style={styles.commentsBlockedBox}>
          <Text style={styles.commentsBlockedTitle}>Comentários bloqueados</Text>
          <Text style={styles.commentsBlockedText}>
            Entre para ler, responder e participar desta denúncia.
          </Text>
          <Pressable
            style={styles.commentsBlockedButton}
            onPress={openCommentsAuthPrompt}
          >
            <Text style={styles.commentsBlockedButtonText}>
              Entrar ou criar conta
            </Text>
          </Pressable>
        </View>
      ) : loading && comments.length === 0 ? (
        <Text style={styles.commentsStateText}>Carregando comentários...</Text>
      ) : comments.length === 0 ? (
        <>
          <Text style={styles.commentsStateText}>
            Ainda não há comentários. Seja o primeiro a comentar.
          </Text>
          <View
            style={styles.commentComposerAnchor}
            onLayout={onComposerAnchorLayout}
          />
        </>
      ) : (
        <>
          <View style={styles.commentsList}>
            {comments.map((comment, index) => (
              <Fragment key={comment.id}>
                <CommentItem
                  complaintId={complaintId}
                  comment={comment}
                  onLike={toggleLike}
                  onReplyCreated={incrementRepliesCount}
                  onReplyPress={onReplyPress}
                  styles={styles}
                />
                {index === 0 && (
                  <View
                    style={styles.commentComposerAnchor}
                    onLayout={onComposerAnchorLayout}
                  />
                )}
              </Fragment>
            ))}
          </View>
        </>
      )}

      {!isBlocked && pageInfo?.hasMore && (
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
