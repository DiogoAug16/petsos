import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6EC',
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    marginTop: 52,
    marginHorizontal: 16,
    marginBottom: 4,
    padding: 16,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: '#F0D8BF',
    backgroundColor: '#FFE8C8',
    overflow: 'hidden',
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#272A3A',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#8D7D78',
  },

  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    padding: 16,
    paddingBottom: 96,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8D7D78',
  },

  emptyBox: {
    marginTop: 92,
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: '#F0D8BF',
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '900',
    color: '#272A3A',
  },

  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: '#8D7D78',
    textAlign: 'center',
  },
});
