import { Content } from "@/app/clients/protos/common_pb";
import { RapidaEnvironment } from "@/utils/rapida_environment";
import { RapidaSource, WEB_PLUGIN_SOURCE } from "@/utils/rapida_source";

// export const toContentText = (cnt?: Content) => {
//   if (!cnt) return "";
//   try {
//     return new TextDecoder().decode(cnt.getContent() as Uint8Array);
//   } catch (error) {
//     return "";
//   }
// };

// /**
//  *
//  * @param str
//  * @returns
//  */
// export const toTextContent = (str: string) => {
//   const cnt = new Content();
//   cnt.setContentformat("raw");
//   cnt.setContenttype("text");
//   cnt.setContent(new TextEncoder().encode(str));
//   return cnt;
// };

export const toTitleCase = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 *
 * @returns
 */
export const GetSource = (): RapidaSource => {
  return WEB_PLUGIN_SOURCE;
};

export const GetEnvironment = (): RapidaEnvironment => {
  if (window.chatbotConfig?.debug == true) return RapidaEnvironment.DEVELOPMENT;
  return process.env.NODE_ENV !== "development"
    ? RapidaEnvironment.PRODUCTION
    : RapidaEnvironment.DEVELOPMENT;
};
