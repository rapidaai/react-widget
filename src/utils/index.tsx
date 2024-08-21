import { Content } from "@/app/clients/protos/common_pb";

export const toContentText = (cnt?: Content) => {
  if (!cnt) return "";
  try {
    return new TextDecoder().decode(cnt.getContent() as Uint8Array);
  } catch (error) {
    return "";
  }
};

/**
 *
 * @param str
 * @returns
 */
export const toTextContent = (str: string) => {
  const cnt = new Content();
  cnt.setContentformat("raw");
  cnt.setContenttype("text");
  cnt.setContent(new TextEncoder().encode(str));
  return cnt;
};

export const toTitleCase = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
