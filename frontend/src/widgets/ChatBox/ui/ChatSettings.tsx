import { SettingsIcon } from 'lucide-react'

import { ColorPicker } from '~/features/change-chat-color'
import { Button } from '~/shared/ui/Button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '~/shared/ui/Popover'

export const ChatSettings = () => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size="icon" variant="outline" aria-label="Chat settings">
            <SettingsIcon />
          </Button>
        }
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Chat settings</PopoverTitle>
          <div className="pt-2">
            <ColorPicker />
          </div>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
