// import { CrownIcon, ShieldIcon, StarIcon } from 'lucide-react'
// import { useIntlayer } from 'react-intlayer'

// import { getAuthorColor, type ChatMessage } from '~/features/chat'

// const roleConfig = {
//   OWNER: { label: 'Broadcaster', Icon: CrownIcon, className: 'text-amber-500' },
//   MODERATOR: { label: 'Moderator', Icon: ShieldIcon, className: 'text-emerald-500' },
//   VIP: { label: 'VIP', Icon: StarIcon, className: 'text-violet-500' },
//   NONE: null,
// } as const

// interface MessageItemProps {
//   message: ChatMessage
// }

// export const MessageItem = ({ message }: MessageItemProps) => {
//   const t = useIntlayer('chat-box')

//   const color = getAuthorColor(message.user.username)
//   const role = message.authorRole !== 'NONE' ? roleConfig[message.authorRole] : null

//   if (message.deletedAt) {
//     return (
//       <li className="flex items-start gap-2 text-sm leading-snug">
//         <p className="text-muted-foreground min-w-0 flex-1 italic">{t.messageDeleted.value}</p>
//       </li>
//     )
//   }

//   return (
//     <li className="flex items-start gap-2 text-sm leading-snug">
//       <p className="min-w-0 flex-1">
//         <span className="inline-flex items-center gap-1 font-semibold" style={{ color }}>
//           {role && (
//             <role.Icon className={`size-3 shrink-0 ${role.className}`} aria-label={role.label} />
//           )}
//           {message.user.username}
//         </span>
//         {': '}
//         <span
//           className={
//             message.status === 'sending'
//               ? 'text-muted-foreground wrap-break-word opacity-60'
//               : 'text-foreground wrap-break-word'
//           }
//         >
//           {message.text}
//         </span>
//       </p>
//     </li>
//   )
// }

export const MessageItem = () => {
  return <div>MessageItem</div>
}
