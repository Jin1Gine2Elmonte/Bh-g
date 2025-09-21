/**
 * Converts a File object to a base64 encoded string, stripping the data URL prefix.
 * @param file The file to convert.
 * @returns A promise that resolves with the pure base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Gemini API expects the raw base64 string, so we strip the data URL prefix
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Pauses execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}