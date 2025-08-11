// firestoreエラーかどうかを判定するガード
export const isFireStoreError = (
  err: unknown
): err is { code: string; message: string } => {
  return typeof err === 'object' && err !== null && 'code' in err;
};
