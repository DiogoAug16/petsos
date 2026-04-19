export const toastStyles = {
  container: {
    width: '90%',
    backgroundColor: '#242B3D',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
  },
  successBorder: {
    borderLeftColor: '#10B981',
  },
  errorBorder: {
    borderLeftColor: '#EF4444',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconBg: {
    backgroundColor: '#10B98120',
  },
  errorIconBg: {
    backgroundColor: '#EF444420',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
};
