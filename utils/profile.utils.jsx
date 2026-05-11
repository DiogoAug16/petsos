export const getJoinedYear = (createdAt) => {
  let rawDate = createdAt;

  if (createdAt?._seconds) {
    rawDate = createdAt._seconds * 1000;
  } else if (createdAt?.seconds) {
    rawDate = createdAt.seconds * 1000;
  }

  const date = rawDate ? new Date(rawDate) : null;
  const year = date?.getFullYear();
  return Number.isFinite(year) ? year : 2024;
};
