import { z } from 'zod'

import { getStorageItem, setStorageItem } from '~/shared/lib/storage'

const STREAM_KEY_MODAL_ACK_KEY = 'stream-key-modal-acknowledged'

export const getStreamKeyModalAck = () =>
  getStorageItem(STREAM_KEY_MODAL_ACK_KEY, z.literal('true'), null) === 'true'

export const setStreamKeyModalAck = () => setStorageItem(STREAM_KEY_MODAL_ACK_KEY, 'true')
