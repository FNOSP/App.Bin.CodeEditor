import axios from 'axios'

import { HOST } from '@/utils/env'

export default axios.create({
  baseURL: `${HOST}/api`,
})
