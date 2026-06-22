import { CheckIcon } from 'lucide-react'

import { Button } from '~/shared/ui/Button'

import { useChangeChatColor } from '../model/useChangeChatColor'

const COLORS = [
  '#FF6B6B',
  '#FFA94D',
  '#FFD43B',
  '#69DB7C',
  '#38D9A9',
  '#22B8CF',
  '#4DABF7',
  '#748FFC',
  '#9775FA',
  '#5F3DC4',
  '#F783AC',
  '#C2255C',
] as const

export const ColorPicker = () => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {COLORS.map((color) => (
        <ColorPickerItem key={color} color={color} />
      ))}
    </div>
  )
}

const ColorPickerItem = ({ color }: { color: string }) => {
  const { currentColor, fetching, changeColor } = useChangeChatColor()

  const isActive = currentColor === color

  return (
    <Button
      key={color}
      type="button"
      variant="outline"
      size="icon-sm"
      isLoading={fetching}
      disabled={fetching || isActive}
      aria-label={`Set chat color to ${color}`}
      aria-pressed={isActive}
      onClick={() => changeColor(color)}
      style={{ backgroundColor: color }}
      className="size-8 rounded-full border-2 p-0"
    >
      {isActive && <CheckIcon className="size-4 text-white" />}
    </Button>
  )
}
