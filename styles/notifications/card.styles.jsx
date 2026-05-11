import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  unreadCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  message: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginLeft: 8,
    marginTop: 4,
  },

  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  time: {
    fontSize: 12,
    color: '#6B7280',
  },

  countBadge: {
    minWidth: 24,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});