export const formatTime = (time: number): string => {
  if (time) {
    const temp = time | 0;
    const minute = temp / 60 | 0;
    const second = (temp % 60).toString().padStart(2, '0');
    return `${minute}:${second}`
  } else {
    return '0:00';
  }
}