// import { Assistant } from "@/app/clients/protos/assistant-api_pb";
// import { FC, HTMLAttributes } from "react";
// import { motion } from "framer-motion";
// import {
//   cn,
//   toHumanReadableRelativeDay,
//   toHumanReadableRelativeTime,
//   toRelativeTime,
// } from "@/styles/media";
// import { ChevronUpIcon } from "@/icons/chevron-up";
// import { AssistantConversation } from "@/app/clients/protos/common_pb";
// import { useChatNavigation } from "@/app/pages/web-plugin-chat/hooks/use-navigate";

// export const RecentConversation: FC<{
//   conversations: AssistantConversation[];
// }> = ({ conversations }) => {
//   const { goToConversation } = useChatNavigation();
//   return (
//     <div className="pks_flex pks_flex-col pks_px-2 pks_space-y-2">
//       {conversations.map((x, idx) => {
//         return (
//           <MotionDiv
//             className="pks_rounded-xl pks_flex-col pks_relative pks_cursor-pointer pks_flex pks_py-2 pks_px-3 pks_overflow-hidden pks_group pks_w-full pks_bg-gray-300/10 hover:pks_bg-gray-300/20 pks_border-[0.1px]"
//             key={idx}
//             onClick={() => {
//               goToConversation(x.getId());
//             }}
//           >
//             <div className="pks_flex pks_w-full">
//               <span className="pks_my-auto  pks_absolute pks_right-4 pks_flex pks_justify-center pks_w-auto pks_h-fit pks_opacity-70 pks_top-0 pks_bottom-0">
//                 <ChevronUpIcon className="pks_rotate-90" strokeWidth={2.5} />
//               </span>
//               <span className="pks_relative pks_text-lg pks_mr-8 pks_text-gray-500 dark:pks_text-gray-400 pks_font-medium pks_op">
//                 {x.getName()}
//               </span>
//             </div>
//             <div className="pks_text-base pks_flex dark:pks_text-gray-600 pks_text-gray-400 pks_opacity-60">
//               {x.getCreateddate() && toRelativeTime(x.getCreateddate()!)}
//             </div>
//           </MotionDiv>
//         );
//       })}
//     </div>
//   );
// };

// interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {}
// export const MotionDiv: FC<MotionDivProps> = ({
//   className,
//   children,
//   ...alts
// }) => {
//   return (
//     <motion.div
//       variants={{
//         initial: {
//           scale: 0.5,
//           y: 50,
//           opacity: 0,
//         },
//         animate: {
//           scale: 1,
//           y: 0,
//           opacity: 1,
//         },
//       }}
//       transition={{
//         type: "spring",
//         mass: 3,
//         stiffness: 400,
//         damping: 50,
//       }}
//       className={cn(
//         "col-span-4 rounded-xl backdrop-blur-lg bg-gray-200/20 dark:bg-slate-800/20 p-6",
//         className
//       )}
//       onClick={alts.onClick}
//     >
//       {children}
//     </motion.div>
//   );
// };
